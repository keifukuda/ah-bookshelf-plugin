#!/bin/bash -e

if [ -n "$(git status --porcelain)" ]; then
    echo "The git working directory is not clean. Exiting."
  exit 1
fi

npm test
npm run clean
npm run build

echo "Enter semantic version name."
echo "(major | minor | patch | prerelease | preminor | premajor)"
read semantic

version=$(npm version $semantic)
echo "Publishing $version"
git push origin master
git push origin $version
npm publish
