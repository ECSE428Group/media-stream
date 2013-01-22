#!/bin/bash

# install node + meteor on either OS X or Ubuntu

function git_install() {
  git clone https://github.com/joyent/node node
  cd node
  ./configure
  make
  make install
}

case "`uname -s`" in
  "Darwin")
    if [ "`command -v node > /dev/null 2>&1`$?" -eq 0 ] ; then
      echo "node's already installed"
    else
      if [ "`command -v brew > /dev/null 2>&1`$?" -eq 0 ] ; then
        echo "brew install node"
        brew install node
      elif [ "`command -v port > /dev/null 2>&1`$?" -eq 0 ] ; then
        echo "sudo port install nodejs"
        sudo port install nodejs
      else
        echo "doing a git install"
        git_install
      fi
    fi
  ;;
  *)
    sudo apt-get install python-software-properties curl
    sudo add-apt-repository ppa:chris-lea/node.jssac
    sudo apt-get update
    sudo apt-get install nodejs npm nodejs-dev
  ;;
esac


if [ "`command -v meteor > /dev/null 2>&1`$?" -eq 0 ] ; then
  echo "meteor's already installed"
else
  curl https://install.meteor.com | /bin/sh
fi
