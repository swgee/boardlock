#!/bin/bash
kill $(ps aux | grep 'SCREEN' | awk '{print $2}')
