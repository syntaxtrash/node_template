#!/bin/bash

# Folder containing the files
# FOLDER_PATH="/path/to/your/folder"
# FOLDER_PATH="./images"
FOLDER_PATH="../public/images"

# MySQL table details
TABLE_NAME="products"
BULK_INSERT_QUERY="INSERT INTO $TABLE_NAME (name, image_path, description, price) VALUES"
values_array=()

# Remove the insert_queries.sql file if it exists
if [ -f "insert_queries.sql" ]; then
    rm "insert_queries.sql"
fi

# Loop through each file in the folder
for FILE in "$FOLDER_PATH"/*; do
    # Check if it is a file (not a directory)
    if [ -f "$FILE" ]; then
        # Get the base name of the file (without the path)
        FILE_NAME=$(basename "$FILE" | sed 's/\.[^.]*$//')
        IMAGE_PATH=$(basename "$FILE")
        # Generate a random price between 100 and 1000
        PRICE=$(shuf -i 100-1000 -n 1)
        # IMAGE_PATH="$FILE"
        
        values_array+=("(\"$FILE_NAME\", \"$IMAGE_PATH\", \"Lorem ipsum dolor sit amet, consectetur adipiscing elit.\", $PRICE)")
        # values_array+=("(\"$FILE_NAME\", \"$IMAGE_PATH\", \"Lorem ipsum dolor sit amet, consectetur adipiscing elit.\", 0)")
    fi
done

# Join and output the array as a single string with ", "
IFS=", "
joined_values="${values_array[*]}"
unset IFS

# Output the MySQL insert queries to a file
echo "INSERT INTO $TABLE_NAME (name, image_path, description, price) VALUES $joined_values" >> insert_queries.sql

# NOTES: Run the following in the terminal
# MAC:
#   chmod +x generate_mysql_queries.sh
# WINDOWS:
#   bash generate_mysql_queries.sh