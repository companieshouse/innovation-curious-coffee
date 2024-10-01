#!/bin/bash
# script to create database changes that are run locally on developers laptop within Docker
    
mongoimport --uri="mongodb://localhost:27017" --db "curious" --collection "DEPARTMENT_CHANGES" --file "update-database/updated-departments-2024.csv" --drop --type=csv --headerline --columnsHaveTypes
