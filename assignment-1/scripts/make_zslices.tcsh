#!/usr/bin/tcsh

set first = 0
set last = 199

set i = $first
while ( $i <= $last )
	set j = `echo $i | awk '{printf("%04d",$0)}'`
	set f = velocity.$j
	echo Converting $f
	gunzip -k < $f.txt.gz | tail +18451200 | head -148800 > zslices/$f.zslice.txt
	@ i ++
end

