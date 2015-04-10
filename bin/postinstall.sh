#!/bin/bash -e

# /project/node_modules/ah-bookshelf-plugin
declare package_root_dir=$(cd $(dirname $0)/..;pwd)

# /project/node_modules/ah-bookshelf-plugin/config/bookshelf.js
declare package_config_file=$package_root_dir/config/bookshelf.js

# /project/node_modules/ah-bookshelf-plugin/models
declare package_model_dir=$package_root_dir/models

# /project/node_modules/ah-bookshelf-plugin/database
declare package_database_dir=$package_root_dir/database


# /project
declare project_root_dir=$(dirname $(dirname $package_root_dir))

# /project/package.json
declare project_package_json_file=$project_root_dir/package.json

# /project/config/plugins
declare project_config_dir=$project_root_dir/config/plugins

# /project/config/plugins/bookshelf.js
declare project_config_file=$project_config_dir/bookshelf.js

# /project/models
declare project_model_dir=$project_root_dir/models

# /project/database
declare project_database_dir=$project_root_dir/database


NRM="\e[0;0m"
RED="\e[0;31m"
GRN="\e[0;32m"

# check package.json
if [ -f $project_package_json_file ]; then
    :
else
    printf "%bERR!: %b" $RED $NRM
    printf "$project_package_json_file does not exist.\n"
    exit 0
fi

# create plugin directory
mkdir -p $project_config_dir

# copy config file
if [ -f $project_config_file ]; then
    :
else
    cp $package_config_file $project_config_file
    printf "%bINFO: %b" $GRN $NRM
    printf "Add config file        to $project_config_file\n"
fi

# copy models directory
if [ -d $project_model_dir ]; then
    :
else
    cp -r $package_model_dir $project_model_dir
    printf "%bINFO: %b" $GRN $NRM
    printf "Add models directory   to $project_model_dir\n"
fi

# copy database directory
if [ -d $project_database_dir ]; then
    :
else
    cp -r $package_database_dir $project_database_dir
    printf "%bINFO: %b" $GRN $NRM
    printf "Add database directory to $project_database_dir\n"
fi

printf "\n"
