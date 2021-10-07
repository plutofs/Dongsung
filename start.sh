cd /home/dostory/DS_node/
forever start -l dongsung.log -e err.log --minUptime 5000 --spinSleepTime 2000 -m 100 -a bin/www