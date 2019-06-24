const readline = require('readline-sync')

function inputs(){

    const content = {
        productName: 'esfirras',
        maximumQuantity: 100,
        peoples: []
    }

    const pricesByEsfirras = [
        1.98, 
        1.98, 
        1.98, 
        2.78,
        3.50,
        2.78,
        3.50,
        3.50             
    ]

    const pricesByDrink = {
        "2l_cocaCola": 11.90,
        "350ml_cocaCola": 8.90,
        water: 5.90,          
    }

    content.peopleAmount = askAndReturnPeopleAmount();
    
    for (let index = 0; index < content.peopleAmount; index++) {
        const peopleName = askAndReturnPeopleName(index)
        const productQuantity = askAndReturnPeopleProductQuantity(peopleName)
        const howPeopleWant = askAndReturnPeopleCart(peopleName, productQuantity)
        const arr = {
            name: peopleName,
            quantity: productQuantity,
            cart: []
        }
        arr.cart = howPeopleWant
        content.peoples.push(arr)
    }
    console.log('Finished! You can see here. (or log in result.json)')
    console.log('___________')  
    var fullQuantity = 0;
   for (let index = 0; index < content.peoples.length; index++) {
        fullQuantity += content.peoples[index].quantity;       
   }
    
    
    console.log('\n')
    console.log('-------::.. Account  ..::--------')
    console.log(content.productName + ' quantity: ' + fullQuantity)
    console.log(content.productName + ' Total R$ ' + sumAllAccountCost(content).toLocaleString('pt-br', {minimumFractionDigits: 2}))
    console.log('_______________')
    console.log('------ Peoples -------')    
    content.peoples.forEach(function(x, index) {
        console.log('> Name: '+ x.name);
        console.log('> Quantity: '+ x.quantity);
        console.log('> Total: R$ '+ sumAllPeopleCost(x).toLocaleString('pt-br', {minimumFractionDigits: 2}));
        console.log('>________________');
        console.log('>> Cart:');
        content.peoples[index].cart.forEach(y => {
            console.log('>>> Product name: '+ y.name)
            console.log('>>> Quantity: '+ y.quantity)
            let atual = y.quantity * y.cost;
            console.log('>>> Total: R$ ' + atual.toLocaleString('pt-br', {minimumFractionDigits: 2}))
        });           
        console.log('\n')
        console.log('______________')        
    });

    var dictstring = JSON.stringify(content);
    var fs = require('fs');
    fs.writeFile('sfiha-' + getFormattedTime() + '.json', dictstring, function(err, result) {
         if(err) console.log('error', err);
    });

    console.log('\n')
    console.log('Finished!')
    console.log('\n')

    function sumAllAccountCost(arr){
        var total = 0;
        for (let index = 0; index < arr.peoples.length; index++) {      
            for (let j = 0; j < arr.peoples[index].cart.length; j++) {
                let cost = arr.peoples[index].cart[j].cost * arr.peoples[index].cart[j].quantity;
                total += cost;
            }               
       }
       return total;
    }

    function getFormattedTime() {
        var today = new Date();
        var y = today.getFullYear();
        // JavaScript months are 0-based.
        var m = today.getMonth() + 1;
        var d = today.getDate();
        var h = today.getHours();
        var mi = today.getMinutes();
        var s = today.getSeconds();
        return y + "-" + m + "-" + d + "-" + h + "-" + mi + "-" + s;
    }


    function sumAllPeopleCost(arr){
        var total =0;
        for (let index = 0; index < arr.cart.length; index++) {
            let t = arr.cart[index].cost * arr.cart[index].quantity;
            total += t;           
        }
        return total;
    }

    function askAndReturnPeopleAmount(){
        let a = Number(readline.question('How many people will participate? '))

        if(isNaN(a)){
            throw new Error('> [ERROR] Invalid quantity amount')
        }

        return a
    }

    function askAndReturnPeopleName(index){
        return readline.question('['+index+'] Whats your name? ')
    }

    function askAndReturnPeopleProductQuantity(index){
        let q = Number(readline.question('['+index+'] How many '+content.productName+' do you want? '))
        while (isNaN(q)) {
            console.log('> [ERROR] Invalid product quantity, repeat.')
            q = Number(readline.question('['+index+'] How many '+content.productName+' do you want? '))
        }
        return q
   }

       
   function askAndReturnPeopleCart(x, productQuantity){
    const cart = []
    const prefix = ['Meat', 'Chicken', 'Calabresa', 'Cheese', 'Four Cheese', 'Italian', 'Peperoni', 'Spinach'];
    var cost = 0;
    var balance = 0;
    var indexName = '';
    var found = false;
    var quantity = 0;

        while(balance < productQuantity)
        {
            let b = productQuantity - balance;
            indexName = readline.keyInSelect(prefix , '['+x+' - Balance: '+ b +'] Choose one option.')
            let askQuantity = Number(readline.question('How many '+content.productName+' of '+prefix[indexName]+' do you want [MAX ' + b + ']? '))

            while(isNaN(askQuantity)){
                console.log('> [ERROR] Invalid quantity. I will ask again.')
                askQuantity = readline.question('How many '+content.productName+' of '+prefix[indexName]+' do you want? ')
            }             
            if(askQuantity > productQuantity || (quantity+askQuantity) > productQuantity){
                console.log('> [ERROR] You need repeat again beacause you trolling.')
                quantity = 0;
                askQuantity = 0;
            }

            quantity += askQuantity

            if(cart.length > 0)
            for (let index = 0; index < cart.length; index++) {
               if(cart[index].name == prefix[indexName]){

                   if((cart[index].quantity + quantity) > productQuantity){

                        while((cart[index].quantity + quantity) > productQuantity){
                            console.log('> [ERROR] You wrong amount of your balance. BALANCE: ' + balance + ', NOW: '+ quantity)
                            quantity = readline.question('How many '+content.productName+' of '+prefix[indexName]+' do you want? ["R" to reset] ')
                            if(quantity == 'R'){
                                console.log('Reseting your cart...')
                                console.log('\n')
                                quantity = 0;
                                cart[index].quantity = 0 ;
                            }

                        }

                    }else{
                        cart[index].quantity += quantity
                        balance = cart[index].quantity;
                        found = true; 
                   }            
               }                
            }

            balance = quantity;

            if(!found){
                let jsn = {
                    name: prefix[indexName],
                    quantity: quantity,
                    cost: pricesByEsfirras[indexName]
                 }
                 cart.push(jsn);
            }

        }

        console.log('\n');
        console.log('Successfully! Continue...')
        console.log('________________________________');
        console.log('\n');


    return cart
   }


    
}

module.exports = inputs
