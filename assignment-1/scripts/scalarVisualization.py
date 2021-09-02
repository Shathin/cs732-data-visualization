import numpy
import pandas
from matplotlib import pyplot, animation
import math

# ! Custom
from scalarFields import *
from dataOps import getFiles, readDataSet, processDataSet, getGlobalMaximaAndMinima


def visualizeStatic(
    dataSet: list[pandas.DataFrame],
    field: dict,
    levels=5,
    colorMap="Blues_r",
    showGrid: bool = False,
    showFigure: bool = True,
    saveFigure: bool = False,
    saveFile: str = "static-output.png",
):
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
    # * Compute levels based on the global values of the field in the data set

    # * Get global max & min of the field in the data set
    gMax, gMin = getGlobalMaximaAndMinima(dataSet=dataSet, field=field)

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
    # timestepRange=[0, 49, 99, 149, 199],
    # timestepRange=[99],
    # timestepRange=range(0, 200, 10),
    # timestepRange=range(0, 200),
    timestepRange = [
        0,
        1,
        2,
        3,
        6,
        9,
        14,
        19,
        29,
        49,
        69,
        99,
        129,
        159,
        189,
    ]
    path: str = "../data/extracted/scalar"

    files: str = getFiles(timestepRange=timestepRange, path=path)

    print("*** Setting field 🎲")
    field = GAS_TEMPERATURE

    print("*** Setting parameters 🛠️")
    animated: bool = True
    levels: int = 15
    colorMap: str = field["colorMap"] if "colorMap" in field else "Blues_r"
    showGrid: bool = False
    showFigure: bool = False
    saveFigure: bool = True
    saveFile: str = f"../outputs/{field['label']}"
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

        dataSet = processDataSet(dataSet=dataSet, field=field)

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
