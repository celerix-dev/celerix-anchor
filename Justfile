#!/usr/bin/env just --justfile
#set windows-shell := ["pwsh.exe", "-NoLogo","-Command"]
set windows-shell := ["C:/Program Files/Git/bin/bash.exe", "-cu"]

default:
    @just --list

# maven build without tests
build:
    ./mvnw -DskipTests clean package

# start quarkus dev mode
dev:
    ./mvnw quarkus:dev

# build native using container
build-native:
    ./mvnw package '-Dnative' '-Dquarkus.native.container-build=true' '-DskipTests'

# dump compile dependencies to dependencies.txt
dependencies:
    ./mvnw dependency:tree -Dscope=compile > dependencies.txt

# dump dependencies updates to updates.txt
updates:
    ./mvnw versions:display-dependency-updates > updates.txt

# Run this to see exactly where Maven is putting things
check-repo:
    ./mvnw help:evaluate -Dexpression=settings.localRepository -q -DforceStdout