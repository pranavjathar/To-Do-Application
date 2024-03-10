import { LightningElement } from 'lwc';

export default class ToDoApp extends LightningElement {
    taskname = ""; 
    taskdate = null;
    incompletetask = [];
    completetask = [];

    changeHandler(event) //concept of destructuring
    {
        let { name, value } = event.target;
        if (name === 'taskname') {
            this.taskname = value;
        }
        else if (name === 'taskdate') {
            this.taskdate = value;
        }
    }

    resetHandler(event) {
        this.taskname = "";
        this.taskdate = null;
    }

    addTaskHandler(event) {
        //if end date is missing the populate todays date as end date
        if (!this.taskdate) {
            this.taskdate = new Date().toISOString().slice(0, 10);
        }
        if (this.validateTask()) {
            this.incompletetask = [...this.incompletetask, //to avoid rendering we are using spread operator 
            {
                taskname: this.taskname,
                taskdate: this.taskdate
            }];
            this.resetHandler(); //value will be reset
            let sortedArray = this.sortTask(this.incompletetask); //tasks are sorted
            this.incompletetask = [...sortedArray]; //to override we use spread operator
            console.log("incompletetask", this.incompletetask);
        }
    }

    validateTask() {
        let isValid = true;
        let element = this.template.querySelector('.taskname');
        //condition 1 -- check if task is empty
        if (!this.taskname) {
            isValid = false; 
            element.setCustomValidity('Task name cannot be empty');
        }
        //condition 2 -- if task name is not empty then check for duplicate
        else {
            let taskItem = this.incompletetask.find(currItem => currItem.taskname === this.taskname && currItem.taskdate === this.taskdate);
            if (taskItem) {
                isValid = false; 
                element.setCustomValidity('Task name is already available');
            }
        }
        if (isValid) {
            element.setCustomValidity("");
        }
        element.reportValidity();
        return isValid;
    }

    sortTask(inputArr) {
        //standard methods comes with JS whenever u have to perform the sorting
        let sortedArray = inputArr.sort((a, b) => {
            const dateA = new Date(a.taskdate);
            const dateB = new Date(b.taskdate);
            return dateA - dateB;
        });
        return sortedArray;
    }

    //from incomplete task array, remove the item
    removalHandler(event) {
        let index = event.target.name;
        this.incompletetask.splice(index, 1); //we use splice() to remove the element from the array
        //again we have to sort the array
        let sortedArray = this.sortTask(this.incompletetask); //tasks are sorted
        this.incompletetask = [...sortedArray]; //to override we use spread operator
        console.log("incompletetask", this.incompletetask);
    }

    completetaskHandler(event) {
        //remove the entry from incomplete item
        let index = event.target.name;
        let completedTask = this.incompletetask.splice(index, 1)[0];
        this.completetask = [...this.completetask, completedTask];
        this.sortTask(this.incompletetask);
    }

    dragStartHandler(event) {
        event.dataTransfer.setData("index", event.target.dataset.item);
    }

    allowDrop(event) {
        event.preventDefault(); //to stop the default behaviour of the event we use event.preventDefault()
    }

    dropElementHandler(event) {
        let index = event.dataTransfer.getData("index");
        this.refreshData(index);
    }

    refreshData(index) {
        let removeItem = this.incompletetask.splice(index, 1); //we use splice() to remove the element from the array. splice() always return array
        let sortedArray = this.sortTask(this.incompletetask); //tasks are sorted
        this.incompletetask = [...sortedArray]; //to override we use spread operator
        console.log("incompletetask", this.incompletetask);
        //add the same entry in complete item 
        this.completetask = [...this.completetask, removeItem[0]];
    }
}