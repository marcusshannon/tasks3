#!/bin/bash

export MIX_ENV=prod
export PORT=2482
export NODEBIN=`pwd`/assets/node_modules/.bin
export PATH="$PATH:$NODEBIN"

echo "Building..."

mkdir -p ~/.config

mix deps.get
mix compile
(cd assets && yarn)
(cd assets && webpack --mode production)
mix phx.digest

echo "Generating release..."
mix release

echo "Stopping old copy of app, if any..."
_build/prod/rel/tracker/bin/tracker stop || true

echo "Starting app..."

_build/prod/rel/tracker/bin/tracker start

