#!/usr/bin/tcsh

# Place this file in the folder where the data files exist and execute using the command `tcsh`

# Timesteps
set first = 0
set last = 199

set i = $first
while ( $i <= $last )
	set j = `echo $i | awk '{printf("%04d",$0)}'`
	set f = vector.$j # File name
	set t = 600*248*125 # Index of the last row to read
	set h = 600*248*2  # Index of the first row to be read (from the last row)
	echo Converting $f
	gunzip -k < $f.txt.gz | tail +$t | head -$h > zslices/$f.zslice.txt
	@ i ++
end

