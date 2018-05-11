#!/usr/bin/env bash

#i=0
#while read line
#do
#    array[ $i ]="$line"
#    filename=$(basename "$line")
#    echo $filename
#    (( i++ ))
#done < <(find . -name "*properties" -type f -exec ls -l {} \;)
cmd='';
i=0
for file in ./*properties; do
   filename=${file##*/}
  # echo $filename
  cmd="$cmd ../kcl-bootstrap --java /usr/bin/java -e -p ./$filename & "
  (( i++ ))
done

cmd="$cmd wait";
#echo "$cmd"
eval $cmd;
