#!/bin/bash -e

# /project/node_modules/ah-bookshelf-plugin
declare package_root_dir=$(cd $(dirname $0)/..;pwd)

# /project/node_modules/ah-bookshelf-plugin/config/bookshelf.js
declare package_config_file=$package_root_dir/config/bookshelf.js

# /project/node_modules/ah-bookshelf-plugin/models
declare package_model_dir=$package_root_dir/models


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


# check package.json
if [ -f $project_package_json_file ]; then
    :
else
    echo $project_package_json_file does not exist.
    exit 0
fi

# create plugin directory
mkdir -p $project_config_dir

# copy config file
if [ -f $project_config_file ]; then
    :
else
    cp $package_config_file $project_config_file
    echo "Add config file      to $project_config_file"
fi

# copy models directory
if [ -d $project_model_dir ]; then
    :
else
    cp -r $package_model_dir $project_model_dir
    echo "Add models directory to $project_model_dir"
fi
