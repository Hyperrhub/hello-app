// import React, { useState } from 'react'
import * as go from 'gojs';
import { ReactDiagram, ReactPalette } from 'gojs-react'; 
import "./BlockDiagram.css";



const BlockDiagram = (props) => {
  // const [diagram, setDiagram]=useState();
    const init=()=>{
        const showLinkLabel =(e)=>{
            let label = e.subject.findObject("LABEL");
            if (label !== null) label.visible = (e.subject.fromNode.data.category === "Conditional");
            return;
        }
        const $ =go.GraphObject.make;
        const mydiagram = $(go.Diagram,
          
            {
            'undoManager.isEnabled': true,
            'clickCreatingTool.archetypeNodeData': {text : 'new node', color : 'lightblue'},
            "LinkDrawn": showLinkLabel, 
          "LinkRelinked": showLinkLabel,
        });


        const nodeStyle =()=>{
          return[
            new go.Binding("location" , "loc" , go.Point.parse).makeTwoWay(go.Point.stringify),
            {
            locationSpot: go.Spot.Center
          }
        ]
        };


        const makePort =(name,align,spot,output,input)=>{
          let horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
          return $(go.Shape,
            {
              fill: "transperent",
              strokeWidth: 0,  // no stroke
          width: horizontal ? NaN : 8,  // if not stretching horizontally, just 8 wide
          height: !horizontal ? NaN : 8,  // if not stretching vertically, just 8 tall
          alignment: align,  // align the port on the main Shape
          stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
          portId: name,  // declare this object to be a "port"
          fromSpot: spot,  // declare where links may connect at this port
          fromLinkable: output,  // declare whether the user may draw links from here
          toSpot: spot,  // declare where links may connect at this port
          toLinkable: input,  // declare whether the user may draw links to here
          cursor: "pointer", 
          mouseEnter: (e, port)=>{
            if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
          },
          mouseLeave: (e, port)=>port.fill = "transperent"

          })
        }


        const textStyle =()=>{
          return {
            font : "bold 11pt Lato, Helvetica, Arial, sans-serif",
            stroke: "#F8F8F8"
          }
        }

        mydiagram.nodeTemplateMap.add("",
        $(go.Node, "Table", nodeStyle(),
        $(go.Panel,"Auto",
        $(go.Shape, "Rectangle",
        {fill :"#282c34", stroke: "#00A9c9", strokeWidth:3.5},
        new go.Binding("figure","figure")),
        $(go.TextBlock,textStyle(),
          {margin: 8, maxSize: new go.Size(160, NaN),wrap: go.TextBlock.WrapFit,editable: true},
          new go.Binding("text").makeTwoWay())
        ),
        makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
        makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
        makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
        makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
        ));

        mydiagram.nodeTemplateMap.add("Conditional",
        $(go.Node, "Table", nodeStyle(),
          // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
          $(go.Panel, "Auto",
            $(go.Shape, "Diamond",
              { fill: "#282c34", stroke: "#00A9C9", strokeWidth: 3.5 },
              new go.Binding("figure", "figure")),
            $(go.TextBlock, textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text").makeTwoWay())
          ),
          // four named ports, one on each side:
          makePort("T", go.Spot.Top, go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, go.Spot.Left, true, true),
          makePort("R", go.Spot.Right, go.Spot.Right, true, true),
          makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        ));


        mydiagram.nodeTemplateMap.add("Start",
        $(go.Node, "Table", nodeStyle(),
          $(go.Panel, "Spot",
            $(go.Shape, "Circle",
              { desiredSize: new go.Size(70, 70), fill: "#282c34", stroke: "#09d3ac", strokeWidth: 3.5 }),
            $(go.TextBlock, "Start", textStyle(),
              new go.Binding("text"))
          ),
          // three named ports, one on each side except the top, all output only:
          makePort("L", go.Spot.Left, go.Spot.Left, true, false),
          makePort("R", go.Spot.Right, go.Spot.Right, true, false),
          makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        ));
  
      mydiagram.nodeTemplateMap.add("End",
        $(go.Node, "Table", nodeStyle(),
          $(go.Panel, "Spot",
            $(go.Shape, "Circle",
              { desiredSize: new go.Size(60, 60), fill: "#282c34", stroke: "#DC3C00", strokeWidth: 3.5 }),
            $(go.TextBlock, "End", textStyle(),
              new go.Binding("text"))
          ),
          // three named ports, one on each side except the bottom, all input only:
          makePort("T", go.Spot.Top, go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, go.Spot.Left, false, true),
          makePort("R", go.Spot.Right, go.Spot.Right, false, true)
        ));
  
        go.Shape.defineFigureGenerator("Ellipse",(shape, w, h)=>{
            let geo= new go.Geometry();
            let fig =new go.PathFigure(0,0, true);
            geo.add(fig);
            fig.add(new go.PathSegment(go.PathSegment.Line, .75 * w, 0));
      fig.add(new go.PathSegment(go.PathSegment.Line, w, .25 * h));
      fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
      fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
      var fig2 = new go.PathFigure(.75 * w, 0, false);
      geo.add(fig2);
      // The Fold
      fig2.add(new go.PathSegment(go.PathSegment.Line, .75 * w, .25 * h));
      fig2.add(new go.PathSegment(go.PathSegment.Line, w, .25 * h));
      geo.spot1 = new go.Spot(0, .25);
      geo.spot2 = go.Spot.BottomRight;
      return geo;
        });

        mydiagram.nodeTemplateMap.add("Comment",
        $(go.Node, "Auto", nodeStyle(),
          $(go.Shape, "Ellipse",
            { fill: "#282c34", stroke: "#DEE0A3", strokeWidth: 3 }),
          $(go.TextBlock, textStyle(),
            {
              margin: 8,
              maxSize: new go.Size(200, NaN),
              wrap: go.TextBlock.WrapFit,
              textAlign: "center",
              editable: true
            },
            new go.Binding("text").makeTwoWay())
          // no ports, because no links are allowed to connect with a comment
        ));
  
        mydiagram.linkTemplate =
        $(go.Link,  // the whole link panel
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5, toShortLength: 4,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
            // mouse-overs subtly highlight links:
            mouseEnter: (e, link) => link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)",
            mouseLeave: (e, link) => link.findObject("HIGHLIGHT").stroke = "transparent",
            selectionAdorned: false
          },
          new go.Binding("points").makeTwoWay(),
          $(go.Shape,  // the highlight shape, normally transparent
            { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
          $(go.Shape,  // the link path shape
            { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
            new go.Binding("stroke", "isSelected", sel => sel ? "dodgerblue" : "gray").ofObject()),
          $(go.Shape,  // the arrowhead
            { toArrow: "standard", strokeWidth: 0, fill: "gray" }),
          $(go.Panel, "Auto",  // the link label, normally not visible
            { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
            new go.Binding("visible", "visible").makeTwoWay(),
            $(go.Shape, "RoundedRectangle",  // the label shape
              { fill: "#F8F8F8", strokeWidth: 0 }),
            $(go.TextBlock, "Yes",  // the label
              {
                textAlign: "center",
                font: "10pt helvetica, arial, sans-serif",
                stroke: "#333333",
                editable: true
              },
              new go.Binding("text").makeTwoWay())
          )
        );


        

        mydiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
        mydiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

        // load();

        // const animateFadeDown=(e)=>{
        //     let diagram = e.diagram;
        //     let animation = new go.Animation();
        //     animation.isViewportUnconstrained = true; // So Diagram positioning rules let the animation start off-screen
        //     animation.easing = go.Animation.EaseOutExpo;
        //     animation.duration = 900;
        //     // Fade "down", in other words, fade in from above
        //     // animation.add(diagram, 'position', diagram.position.copy().offset(0, 200), diagram.position);
        //     // animation.add(diagram, 'opacity', 0, 1);
        //     animation.start();
            
        // }

        let myPalette =  new go.Palette(
        {
            "animationManager.initialAnimationStyle": go.AnimationManager.None,
            // "InitialAnimationStarting": animateFadeDown(),
            nodeTemplateMap: mydiagram.nodeTemplateMap,  // share the templates used by myDiagram
            model: new go.GraphLinksModel([  // specify the contents of the Palette
              { category: "Start", text: "Start" },
              { text: "Step" },
              { category: "Conditional", text: "???" },
              { category: "End", text: "End" },
              { category: "Comment", text: "Comment" }
            ])
        
        }
        
        )
        
        
        return [mydiagram, myPalette ];
    }
  return (
    <>
    <div className='align'>
    <ReactPalette initPalette={()=>init()[1]} divClassName='myPaletteDiv'></ReactPalette>
    <ReactDiagram initDiagram={()=>init()[0]} divClassName='div-component'
    nodeDataArray={props.nodedata}
    linkDataArray={props.linkdata}>
      

    </ReactDiagram>

    </div>
    {/* <ReactDiagram divClassName='myPaletteDiv'/> */}
    
    </>
    
    
  )
}

export default BlockDiagram
