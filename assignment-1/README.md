# CS 732 Data Visualization

## Assignment 1 - IEEE Visualization 2008 Design Contest

Contest Page: [IEEE Visualization 2008 Design Contest](http://sciviscontest.ieeevis.org/2008/index.html)

Assignment document: **CS732-DV_Assignment-1.pdf**

---

## Running the scripts
All the scripts can be found under the **scripts** directory. 

- Input files : The program expects an already sliced data set. Modify the `make_zslices.tcsh` file to help with the preprocessing of the data.
- `dataOps.py` → Contains methods that reads and processes the data
- `formulae.py` → Contains the different scalar formulae that can be applied on the fields in the dataset
- `scalarFields.py` → A configuration file that defines each of the given scalar fields and the derived fields. Each field is a dictionary containing different attributes that define the properties of the field.
- `scalarVisualization.py` → The python script that reads and visualizes the desired scalar field from the data set. The file contains scripts for both static and animated visualizations.


Execute the `scalarVisualization.py` to generate the visualizations. The parameters to the visualization can be changed by modifying the values of the paramter variables.
- `timestepRange` - The time step range which determines which fields to be read. The files name default to the format multifield.{timestep}.zslice.txt". This can changed in the `getFiles()` method in the `dataOps.py` file.
- `path` - The path to the file(s) to be read (accepts `str`)
- `field` - The field to be visualized. The list of fields is available in the `scalarFields.py` file.
- `animated` -  Whether the moving visualization should be shown (accepts `True` or `False`)
- `levels` - Number of levels in the colorbar (accepts an `integer`)
- `showGrid` - Whether the grid lines should be show (accepts `True` or `False`)
- `showFigure` -  Whether the figure must be shown (accepts `True` or `False`)
- `saveFigure` -  Whether the figure must be saved (accepts `True` or `False`)
- `saveFile` - The name of the save file with path but without extension (accepts `str`)
- `fps` -  Number of frames per second of the moving visualization (accepts `integer`)
- `repeat` -  Whether the moving visualization must repeat (accepts `True` or `False`)

To modify the color for a field or other properties of a field go to the `scalarFields.py` file and modify the appropriate dictionary. 

---


## Visualizations

Check the **outputs** directory for the generated visualizations.

Check the **Report.pdf** for the techincal report of this assignment. You can also read it on [Notion](https://shathin.notion.site/Assignment-1-IEEE-Visualization-2008-Design-Contest-3182fa8dc0f049c3abfbc28aa1336eb2).