import numpy
import pandas
from matplotlib import pyplot, animation
import math

# ! Custom
from scalarFields import *
from dataOps import readDataSet, computeDerivedScalarFields, getGMaxMin


def visualizeStatic(
    dataSet: list[pandas.DataFrame],
    field: dict,
    levels=5,
    colorMap="Blues_r",
    showGrid: bool = False,
    showFigure: bool = True,
    saveFigure: bool = False,
    saveFile: str = "static-output",
):
    """
    Creates a contour fill plot for all the `pandas.DataFrames` passed in as the argument.

    Parameters:
    - dataSet - A list of pandas.DataFrame that represent the dataset
    - field - The field to be used as the 3rd dimension of the contour fill plot
    - levels - Number of levels of contours
    - colorMap - Color map to be used for the fills
    - showGrid - Show grid lines on the figure
    - showFigure - Show the plot in an interactive window
    - saveFigure - Save the figure to a file
    - saveFile - The save file name to be used
    """
    # * Define the X and Y co-ordinate range
    X: list[int] = numpy.arange(0.0, 0.6, 0.001)
    Y: list[int] = numpy.arange(0.0, 0.248, 0.001)

    for index, data in enumerate(dataSet):
        # * Reshape Z field values
        Z = numpy.array(data.iloc[:, 0]).reshape(len(Y), len(X))

        # * Define figure
        pyplot.figure(figsize=(10, 5))

        # * Define axis labels
        pyplot.xlabel("X | parsec")
        pyplot.ylabel("Y | parsec")

        # * Set X and Y Ticks
        pyplot.xticks(numpy.arange(min(X), max(X), 0.06))
        pyplot.yticks(numpy.arange(min(Y), max(Y), 0.03))

        # * Define title
        pyplot.title(f"{field['label']} | {field['unit']}")

        # * Draw Contour Fill plot
        pyplot.contourf(
            X,
            Y,
            Z,
            levels,
            cmap=colorMap,
        )

        # * Add color bar
        pyplot.colorbar(label=field["unit"])

        if showGrid:
            # * Show grid lines
            pyplot.grid(linestyle="--", linewidth=0.25)

        if saveFigure:
            print("*** *** Saving figure 💾")
            pyplot.savefig(f"{saveFile} - {index}.png")

        if showFigure:
            print("*** *** Showing figure 🖥️")
            pyplot.show()


def visualizeMoving(
    dataSet: list[pandas.DataFrame],
    field: dict,
    levels=5,
    colorMap="Blues_r",
    showGrid: bool = False,
    showFigure: bool = True,
    saveFigure: bool = False,
    saveFile: str = "moving-output.gif",
    fps: int = 24,
    repeat: bool = True,
):
    """
    Creates a moving (animated) contour fill plot for all the `pandas.DataFrames` passed in as the argument.

    Parameters:
    - dataSet - A list of pandas.DataFrame that represent the dataset
    - field - The field to be used as the 3rd dimension of the contour fill plot
    - levels - Number of levels of contours
    - colorMap - Color map to be used for the fills
    - showGrid - Show grid lines on the figure
    - showFigure - Show the plot in an interactive window
    - saveFigure - Save the figure to a file
    - saveFile - The save file name to be used
    - fps - The frames per second to be used in GIF file
    - repeat - Whether the animation must repeat while being showing in the interactive mode
    """
    # * Define the X and Y co-ordinate range
    X: list[int] = numpy.arange(0.0, 0.6, 0.001)
    Y: list[int] = numpy.arange(0.0, 0.248, 0.001)

    # * Reshape Z field values
    Z = numpy.array(dataSet[0].iloc[:, 0]).reshape(len(Y), len(X))

    # * Create a figure
    figure = pyplot.figure(figsize=(10, 5))

    # * Define Axis Labels
    pyplot.xlabel("X | parsec")
    pyplot.ylabel("Y | parsec")

    # * Set X and Y Ticks
    pyplot.xticks(numpy.arange(min(X), max(X), 0.06))
    pyplot.yticks(numpy.arange(min(Y), max(Y), 0.03))

    # * Define title
    pyplot.title(f"{field['label']} | {field['unit']}")

    pyplot.contourf(
        X,
        Y,
        Z,
        levels,
        cmap=colorMap,
    )

    # * Add color bar
    pyplot.colorbar(label=field["unit"])

    if showGrid:
        # * Show grid lines
        pyplot.grid(linestyle="--", linewidth=0.25)

    def animate(iter: int):
        """
        Subroutine to the `animation.FuncAnimation()` method
        """
        # * Reshape the value to be an array of dimension Y x X
        Z = numpy.array(
            dataSet[iter].iloc[:, 0],
        ).reshape(len(Y), len(X))

        return pyplot.contourf(
            X,
            Y,
            Z,
            levels,
            cmap=colorMap,
        )

    # * Create animation
    contourFillPlotAnimation = animation.FuncAnimation(
        figure,
        animate,
        frames=len(dataSet) - 1,
        repeat=repeat,
    )

    if saveFigure:
        print("*** *** Saving figure 💾")
        contourFillPlotAnimation.save(f"{saveFile}.gif", fps=fps)

    if showFigure:
        print("*** *** Showing figure 🖥️")
        pyplot.show()


def visualize(
    dataSet: list[pandas.DataFrame],
    field: dict,
    animated: bool = False,
    levels=5,
    showGrid: bool = False,
    colorMap="Blues_r",
    showFigure: bool = True,
    saveFigure: bool = False,
    saveFile: str = "output",
    fps: int = 24,
    repeat: bool = True,
):
    """
    Wrapper method that performs a commong action before calling the `visualizeStatic()` or `visualizeMoving()` based on the parameters passed.

    Parameters:
    - dataSet - A list of pandas.DataFrame that represent the dataset
    - field - The field to be used as the 3rd dimension of the contour fill plot
    - animated - Determines which type of plot to be show i.e., static or animated
    - levels - Number of levels of contours
    - colorMap - Color map to be used for the fills
    - showGrid - Show grid lines on the figure
    - showFigure - Show the plot in an interactive window
    - saveFigure - Save the figure to a file
    - saveFile - The save file name to be used
    """
    # * Compute levels based on the global values of the field in the data set
    # * Get global max & min of the field in the data set
    gMax, gMin = getGMaxMin(dataSet=dataSet, field=field)

    # * Determine levels
    levels = numpy.linspace(gMin, gMax, levels)

    print("*** Visualizing 📈")
    if animated and len(dataSet) > 1:
        # * Show an animated plot
        visualizeMoving(
            dataSet=dataSet,
            field=field,
            levels=levels,
            colorMap=colorMap,
            showGrid=showGrid,
            showFigure=showFigure,
            saveFigure=saveFigure,
            saveFile=saveFile,
            fps=fps,
            repeat=repeat,
        )
    else:
        # * Show a static plot
        visualizeStatic(
            dataSet=dataSet,
            field=field,
            levels=levels,
            showGrid=showGrid,
            colorMap=colorMap,
            showFigure=showFigure,
            saveFigure=saveFigure,
            saveFile=saveFile,
        )


if __name__ == "__main__":
    print("*** Getting file names 🗃️")

    # timestepRange=[99]
    # timestepRange=range(0, 200, 10)
    timestepRange = [1, 2, 3, 6, 9, 14, 19, 29, 49, 69, 99, 129, 159, 189]

    path: str = "./data/extracted/scalar"

    files: list[str] = [
        rf"{path}/multifield.{'{:04d}'.format(timestep)}.zslice.txt"
        for timestep in timestepRange
    ]

    print("*** Setting field 🎲")

    field = GAS_TEMPERATURE
    # field = TOTAL_PARTICLE_DENSITY
    # field = H_NUMBER_DENSITY
    # field = H_MINUS_NUMBER_DENSITY
    # field = H_PLUS_NUMBER_DENSITY

    print()
    print(f"*** Field:  {field['label']}")
    print("*** Setting parameters 🛠️")
    animated: bool = True
    levels: int = 15
    colorMap: str = field["colorMap"] if "colorMap" in field else "Blues_r"
    showGrid: bool = False
    showFigure: bool = False
    saveFigure: bool = True
    saveFile: str = f"./outputs/{field['label']}"
    fps: str = 5
    repeat: bool = True

    print("*** Reading data files 📃")
    if field["fieldType"] == "given":
        dataSet: list[pandas.DataFrame] = readDataSet(
            files=files,
            fields=[field],
        )

    elif field["fieldType"] == "derived":
        dataSet: list[pandas.DataFrame] = readDataSet(
            files=files,
            fields=[
                TOTAL_PARTICLE_DENSITY,
                H_MASS_ABUNDANCE,
                H_PLUS_MASS_ABUNDANCE,
                HE_MASS_ABUNDANCE,
                HE_PLUS_MASS_ABUNDANCE,
                HE_PLUS_PLUS_MASS_ABUNDANCE,
                H_MINUS_MASS_ABUNDANCE,
                H2_MASS_ABUNDANCE,
                H2_PLUS_MASS_ABUNDANCE,
            ],
        )

        dataSet = computeDerivedScalarFields(
            dataSet=dataSet,
            fields=[field],
        )

    visualize(
        dataSet=dataSet,
        field=field,
        animated=animated,
        levels=levels,
        showGrid=showGrid,
        colorMap=colorMap,
        showFigure=showFigure,
        saveFigure=saveFigure,
        saveFile=saveFile,
        fps=fps,
        repeat=repeat,
    )
