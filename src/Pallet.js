import React from 'react'
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
const Pallet = (props) => {
    let myPalette =  new go.Palette("myPaletteDiv", 
    {
        "animationManager.initialAnimationStyle": go.AnimationManager.None,
        // "InitialAnimationStarting": animateFadeDown(),
        nodeTemplateMap: props.diagram.nodeTemplateMap,  // share the templates used by myDiagram
        model: new go.GraphLinksModel([  // specify the contents of the Palette
          { category: "Start", text: "Start" },
          { text: "Step" },
          { category: "Conditional", text: "???" },
          { category: "End", text: "End" },
          { category: "Comment", text: "Comment" }
        ])
    
    }
    
    )
  return (
    <div>
      <ReactDiagram Pallet={myPalette}/>
    </div>
  )
}

export default Pallet

