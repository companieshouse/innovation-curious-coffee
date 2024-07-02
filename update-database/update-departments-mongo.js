db.DEPARTMENT_CHANGES.find().forEach(function(change) {
    // Extract old_name and new_name
    var old_name = change.old_name;
    var new_name = change.new_name;
    
    print("old_name [" + old_name + "]");
    print("new_name [" + new_name + "]");
    
    // Step 3: Update the peoples collection
    db.people.updateMany(
        { department: old_name },
        { $set: { department: new_name } }
    );
});

print("Department updates completed.");