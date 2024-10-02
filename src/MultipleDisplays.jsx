import React, { useState, useRef, useEffect, useMemo } from "react";

function MultipleDisplays() {
  const [currentElement, setCurrentElement] = useState({
    aspect: "4x3",
    diagonal: "",
    customLength: "",
    customBreadth: "",
  }); //Properties to draw different screen previews

  const [elements, setElements] = useState([]);

  const canvasRef = useRef(null);

  const [scaleFactor, scaleFactorSetter] = useState(50);

  //   const color = useMemo(() => {
  //     return `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
  //   }, []);

  const colors = [
    "#FF000080", // Red
    "#00FF0080", // Green
    "#0000FF80", // Blue
    "#FFFF0080", // Yellow
    "#FF00FF80", // Purple
    "#00FFFF80", // Cyan
    "#80808080", // Gray
    "#FF8C0080", // Orange
    "#80008080", // Purple
  ];
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const color = useMemo(() => {
    return getRandomColor();
  }, []); //Using useMemo to remember the random color till refresh

  //Scaling the canvas

  const handleScaleUp = () => {
    if (scaleFactor < 150) {
      scaleFactorSetter(scaleFactor + 3);
    }
  };

  const handleScaleDown = () => {
    if (scaleFactor > 10) {
      scaleFactorSetter(scaleFactor - 3);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Drawing each element on the canvas
      elements.forEach((element, index) => {
        const { aspect, diagonal, customLength, customBreadth } = element;
        const [aspectX, aspectY] = aspect.split("x").map(Number);

        // Calculation of dimensions based on aspect and diagonal
        let length, breadth;
        if (aspect === "custom") {
          length =
            (diagonal * customLength) /
            Math.sqrt(customLength ** 2 + customBreadth ** 2);
          breadth =
            (diagonal * customBreadth) /
            Math.sqrt(customLength ** 2 + customBreadth ** 2);
        } else {
          length =
            (diagonal * aspectX) / Math.sqrt(aspectX ** 2 + aspectY ** 2);
          breadth =
            (diagonal * aspectY) / Math.sqrt(aspectX ** 2 + aspectY ** 2);
        }

        // Drawing the rectangle
        ctx.fillStyle = color; //`rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
        ctx.fillRect(0, 0, length * scaleFactor, breadth * scaleFactor);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, length * scaleFactor, breadth * scaleFactor);
      });
    }
  }, [elements, scaleFactor, color]);

  const addElement = () => {
    // console.log(currentElement.customBreadth);
    if (currentElement.diagonal > 0)
      // && ((currentElement.customLength || currentElement.customLength > 0) && (currentElement.customBreadth && currentElement.customBreadth > 0 ))) //have to correct
      setElements([...elements, currentElement]);
    setCurrentElement({
      aspect: currentElement.aspect,
      diagonal: "",
      customLength: "",
      customBreadth: "",
    });
  };

  const removeElement = (index) => {
    const updatedElements = [...elements];
    updatedElements.splice(index, 1);
    setElements(updatedElements);
  };
  // Return with aspect dropdown menu, diagonal, buttons to add and scale, finally the preview of comparisons in canvas
  return (
    <div className="displays-container">
      <div className="aspect-dropdown">
        <label>Aspect:</label>
        <select
          class="input-area"
          value={currentElement.aspect}
          onChange={(e) =>
            setCurrentElement({ ...currentElement, aspect: e.target.value })
          }
        >
          <option value="4x3">4x3 (iPad or CRT TV)</option>
          <option value="16x10"> 16x10 (Android Tablet)</option>
          <option value="16x9">16x9 (Standard)</option>
          <option value="19.5x9">19.5x9 (Phone)</option>
          <option value="21x9">21x9 (Cinematic)</option>
          <option value="custom">Custom</option>
        </select>

        {currentElement.aspect === "custom" && (
          <div className="custom-fields">
            <div className="custom-aspects">
              <label>X Aspect:</label>
              <input
                class="input-area"
                type="number"
                value={currentElement.customLength}
                onChange={(e) =>
                  setCurrentElement({
                    ...currentElement,
                    customLength: e.target.value,
                  })
                }
              />
              <label>Y Aspect:</label>
              <input
                class="input-area"
                type="number"
                value={currentElement.customBreadth}
                onChange={(e) =>
                  setCurrentElement({
                    ...currentElement,
                    customBreadth: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}
      </div>

      <div className="inputs-and-buttons">
        <div>
          <label>Diagonal:</label>
          <input
            class="input-area"
            type="number"
            value={currentElement.diagonal}
            onChange={(e) =>
              setCurrentElement({ ...currentElement, diagonal: e.target.value })
            }
          />
        </div>

        <button onClick={addElement} id="add-button">
          Add
        </button>
        <button onClick={handleScaleUp} className="scale-button">
          Scale+
        </button>
        <button onClick={handleScaleDown} className="scale-button">
          Scale-
        </button>
      </div>
      <ul className="display-list">
        {elements.map((element, index) => (
          <li
            key={index}
            className="display-item"
            style={{ listStyleType: "none" }}
          >
            <div>
              <label>Aspect:</label>
              <span>
                {element.aspect === "custom"
                  ? `${element.customLength}x${element.customBreadth}`
                  : element.aspect}
              </span>
            </div>
            <div>
              <label>Diagonal:</label>
              <span>{element.diagonal}</span>
            </div>
            <button onClick={() => removeElement(index)} id="remove-button">
              Remove
            </button>
          </li>
        ))}
      </ul>
      <canvas ref={canvasRef} width={1536} height={1024} />
    </div>
  );
}

export default MultipleDisplays;
