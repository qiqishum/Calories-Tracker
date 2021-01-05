//storage controller
const StorageCtrl = (function () {
    //public method
    return {
        storeItem: function (item) {
            let items;
            //check if there is item in local(localStorage just can hold string by default)
            if (localStorage.getItem('items') === null) {
                items = [];
                //push new item
                items.push(item);
                //set localstorage, wrap item into string
                localStorage.setItem('items', JSON.stringify(items))
            } else {
//get local items, by default it's a string, turn into an object
                items = JSON.parse(localStorage.getItem('items'));

                //push new item
                items.push(item);

                //re set localstorage
                localStorage.setItem('items', JSON.stringify(items))

            }
        },


        getItemsFromStorage: function () {
            let items;
            if (localStorage.getItem('items' === null)) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },

        updateItemStorage: function (updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));
            //loop through the items
            items.forEach(function (item, index) {
                //if already in the localstorage,
                // then delete the old one and replace with the updated item
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);

                }
            });
            localStorage.setItem('items', JSON.stringify(items));

        },


        deleteItemFromStorage: function (id) {
            let items = JSON.parse(localStorage.getItem('items'));
            //loop through the items
            items.forEach(function (item, index) {
                //if already in the localstorage,
                // then delete the old one and replace with the updated item
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));

        },

        clearItemsFromStorage: function () {
            localStorage.removeItem('items')
        },
    }
})();


//Item controller for local data

const ItemCtrl = (function () {
    // console.log(' from item ctrl')

    //item constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        // items: [
        //     // {id: 0, name: 'egg', calories: 200},
        //     // {id: 1, name: 'ham', calories: 600},
        //     // {id: 3, name: 'kiwi', calories: 340},
        // ],

        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

//public methods
    return {
        getItem: function () {
            return data.items;
        },

        addItem: function (name, calories) {
            let ID;
            //create ID, if there alreadr has items then index should be id after the last items or else start at 0
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0;
            }

            //calories to number
            calories = parseInt(calories);

            //create new item
            newItem = new Item(ID, name, calories);

            //add to items array
            data.items.push(newItem);

            return newItem;
        },

        getItemById: function (id) {
            let found = null;
            //loop through the item
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            })
            return found;
        },


        //update item
        updateItem: function (name, calories) {
            // Calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },


        deleteItem: function (id) {
            //get ids using map method
            const ids = data.items.map(function (item) {
                return item.id
            });

            //get the index
            const index = ids.indexOf(id);

            //remove item
            data.items.splice(index, 1);

        },

        clearAllItems: function () {
            data.items = [];
        },


        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getCurrentItem: function () {
            return data.currentItem;
        },
        getTotalCalories: function () {
            let total = 0;

            //loop through items and add cals
            data.items.forEach(function (item) {
                total += item.calories;
            })

            //set total cal in data structure
            data.totalCalories = total;

            //return total cal
            return data.totalCalories;
        },

        logData: function () {
            return data;
        },

    }
})();


//ui ctrl for hiding showing and get things from input
const UICtrl = (function () {
    console.log(' from item ctrl');
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
    }
    //public method
    return {

        //loop through all the items, appending the li
        populateItemList: function (items) {
            let html = '';

            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name} </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>`;
            });
            //insert list item
            document.querySelector(UISelectors.itemList).innerHTML = html;

        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value,
            }
        },
        addListItem: function (item) {
            //show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';

            //create li element
            const li = document.createElement('li');
            // add class
            li.className = 'collection-item';

            //add ID
            li.id = `item-${item.id}`;

            //add html
            li.innerHTML = `<strong>${item.name} </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;

            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)

        },

        //update list item
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function (listItem) {
                const itemID = listItem.getAttribute('id');

                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
                }
            });
        },


        deleteListItem: function (id) {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },


        //clear input field
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';

        },
        //get currentItem name and calories
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value =
                ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value =
                ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();

        },

        removeItems: function () {
            let listItems = document.querySelector(UISelectors.listItems);

            //turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function (item) {
                item.remove();
            });
        },

        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent
                = totalCalories;

        },

        //create clearEditState function and will be called in init
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function () {

            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function () {
            return UISelectors;
        },

    }
})();


//app ctrl init event listener
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    //console.log(' from item app', ItemCtrl.logData())

    //load event listeners

    const loadEventListener = function () {
        //get UI selectors
        const UISelectors = UICtrl.getSelectors();

        //add item event
        document.querySelector(UISelectors.addBtn)
            .addEventListener('click', itemAddSubmit);


        //disable submit on enter
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });


        //edit icon click event
        //since this icon is created after the DOM loaded , can't target this directly
        //have to use event deligator
        //target the li of the item
        //edit icon click event
        document.querySelector(UISelectors.itemList)
            .addEventListener('click', itemEditClick);


        //update item event
        document.querySelector(UISelectors.updateBtn)
            .addEventListener('click',
                itemUpdateSubmit);


        //delete item event
        document.querySelector(UISelectors.deleteBtn)
            .addEventListener('click',
                itemDeleteSubmit);


//back button event
        document.querySelector(UISelectors.backBtn)
            .addEventListener('click',
                UICtrl.clearEditState);

        //clear item event
        document.querySelector(UISelectors.clearBtn)
            .addEventListener('click',
                clearAllItemClick);

    }

    // Add item submit
    const itemAddSubmit = function (e) {
        //get form input from UI ctrl
        const input = UICtrl.getItemInput();

        //check for name and calories input
        if (input.name !== '' && input.calories !== '') {
            //add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //add item to ui list
            UICtrl.addListItem(newItem);

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //add total cal to UI
            UICtrl.showTotalCalories(totalCalories);

            //store in localStorage
            StorageCtrl.storeItem(newItem);

            //clear fields
            UICtrl.clearInput();

        }
        e.preventDefault();
    }

    //click edit item
    const itemEditClick = function (e) {

        //console.log('test');
//target the icon inside this li
        //check if this li have contains edit-item
        if (e.target.classList.contains('edit-item')) {
//console.log('edit item');

            //get list item id, icon's parent's parent contains the id
            //click <i>, looks for its parent<a>, then <a>'s parent <li>
            //this listId just return 'item-0' not real id
            const listId = e.target.parentNode.parentNode.id;
            console.log(listId);

            //break listId into an array , then get the actual id like 0,1,2...
            const listIdArr = listId.split('-');

            //get the actual id, index of 1 of the listIdArr, and make sure is number
            const id = parseInt(listIdArr[1]);

            //get item
            const itemToEdit = ItemCtrl.getItemById(id);

            //console.log(itemToEdit);
            //set current item

            ItemCtrl.setCurrentItem(itemToEdit);

            //add item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    //update item submit
    const itemUpdateSubmit = function (e) {
//console.log('update')
        // Get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //update localstorage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }


    //delete button event
    const itemDeleteSubmit = function (e) {
        //console.log(123);

        //get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);


        //delete from ui
        UICtrl.deleteListItem(currentItem.id);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //delete from ls
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();


        e.preventDefault();
    }

//clear all items event
    const clearAllItemClick = function () {
        //Delete all items from data
        ItemCtrl.clearAllItems();

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //remove from UI
        UICtrl.removeItems();

        //clear from localstorage
        StorageCtrl.clearItemsFromStorage();

        //hide ul
        UICtrl.hideList();

    }


    return {
        init: function () {
            // console.log('init');

            //clear clearEditState
            UICtrl.clearEditState();

            //fetch data from data structure
            const items = ItemCtrl.getItem();
            //console.log(items);

            //check if any items, if no then hide the list, if yes then populate the items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                //populate list with items
                UICtrl.populateItemList(items);
            }

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //add total cal to UI
            UICtrl.showTotalCalories(totalCalories);


            //load event listener
            loadEventListener();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);


App.init();
