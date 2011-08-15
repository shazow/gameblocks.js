#!/bin/bash

function fetch_compiler() {
    save_to="$1"
    save_dir="${save_to%/*}"

    mkdir -p "$save_dir"
    (wget http://closure-compiler.googlecode.com/files/compiler-latest.tar.gz -O- | tar -xzv -f- -C "$save_dir") || fail "Could not download the compiler."
}

function add_prefix() {
    sep="$1"
    shift
    while (($#)); do
        echo -n "$sep $1 ";
    shift
    done
}

function fail() {
    echo "Failed: $1"
    exit -1
}



COMPILER_PATH="closure/compiler.jar"
COMPILER_CMD="java -jar $COMPILER_PATH"

OUTPUT_FLAG="--js_output_file gameblocks.js"
#EXTRA_FLAGS="--compilation_level ADVANCED_OPTIMIZATIONS"

if [ ! -f "closure/compiler.jar" ]; then
    echo "Closure compiler not found, downloading..."
    fetch_compiler "$COMPILER_PATH"
fi

targets="$(add_prefix --js src/*.js)"
targets="$targets $(add_prefix --externs externs/*.js)"

echo -n "Compiling... "
$COMPILER_CMD $OUTPUT_FLAG $EXTRA_FLAGS $targets || fail "Could not compile."
echo "Done."
