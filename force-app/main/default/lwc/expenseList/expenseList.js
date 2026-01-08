import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getRecentExpenses from '@salesforce/apex/ExpenseService.getRecentExpenses';
import getExpenses from '@salesforce/apex/ExpenseService.getExpenses';

export default class ExpenseList extends LightningElement {

    // ================= CONFIG =================

    columns = [
        { label: 'Id', fieldName: 'Id'},
        { label: 'Name', fieldName: 'Name'},
        { label: 'Amount', fieldName: 'Amount__c'},
        { label: 'Expense Date', fieldName: 'ExpenseDate__c'},
        { label: 'Expense Category', fieldName: 'ExpenseCategory__c'},
        { label: 'Expense Description', fieldName: 'ExpenseDescription__c'}
    ];

    categoryOptions = [
        { label: 'All', value: '' },
        { label: 'Food', value: 'Food' },
        { label: 'Health', value: 'Health' },
        { label: 'Entertainment', value: 'Entertainment' },
        { label: 'For home', value: 'For home' },
        { label: 'Restaraunts', value: 'Restaraunts' },
        { label: 'Education', value: 'Education' },
        { label: 'Gifts', value: 'Gifts' },
        { label: 'Family', value: 'Family' },
        { label: 'Training', value: 'Training' },
        { label: 'Transport', value: 'Transport' },
        { label: 'Other', value: 'Other' }
    ];

    // ================= STATE =================
    expenses;
    error;

    startDate;
    endDate;
    category = '';
    
    isModalOpen = false;

    wiredExpensesResult;

    // ================= COMPUTED =================
    get hasExpenses() {
        return this.expenses && this.expenses.length > 0;
    }

    // ================= WIRE =================
    @wire(getRecentExpenses)
    wiredExpenses(result) {
        this.wiredExpensesResult = result;
        
        if (result.data) {
            this.expenses = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.expenses = undefined;
        }
    }

    // ================= FILTER HANDLERS =================
    handleStartDateChange(event) {
        this.startDate = event.target.value;
    }

    handleEndDateChange(event) {
        this.endDate = event.target.value;
    }

    handleCategoryChange(event) {
        this.category = event.detail.value;
    }

    handleApplyFilters() {
        getExpenses({
            startDate: this.startDate || null,
            endDate: this.endDate || null,
            category: this.category || ''
        })
        .then(result => {
            this.expenses = result;
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
            this.expenses = undefined;
        });
    }

    // ================= MODAL HANDLERS =================
    openModal() {
        this.isModalOpen = true;
    }

    handleModalClose(event) {
        this.isModalOpen = false;

        if (event.detail && event.detail.recordId) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Expense created successfully',
                    variant: 'success'
                })
            );

            refreshApex(this.wiredExpensesResult);
        }
    }
}