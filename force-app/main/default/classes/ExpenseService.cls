public with sharing class ExpenseService {
    
    @AuraEnabled(cacheable=true) 
    // Return the most recent expenses for initial page load
    public static List<Expense__c> getRecentExpenses() {
        return [
            SELECT Id, Name, Amount__c, ExpenseDate__c,
                   ExpenseCategory__c, ExpenseDescription__c
            FROM Expense__c
            ORDER BY ExpenseDate__c DESC
            LIMIT 50
        ];
    }

    @AuraEnabled(cacheable=true)
    // Returns expenses filtered by optional date range and category
    public static List<Expense__c> getExpenses(
        Date startDate, 
        Date endDate, 
        String category
    ) {
        // Build dynamic SOQL query based on provided filters
        String query =
        'SELECT Id, Name, Amount__c, ExpenseDate__c, ' +
        'ExpenseCategory__c, ExpenseDescription__c ' +
        'FROM Expense__c WHERE Id != null';

        if (startDate != null) {
            query += ' AND ExpenseDate__c >= :startDate';
        } 
        
        if (endDate != null) {
            query += ' AND ExpenseDate__c <= :endDate'; 
        }

        if (String.isNotBlank(category)) {
            query += ' AND ExpenseCategory__c = :category';
        } 
        
        query += ' ORDER  BY ExpenseDate__c DESC LIMIT 50';

        return Database.query(query);
    }
}