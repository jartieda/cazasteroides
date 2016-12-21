/*
* Copyright 2007 JORGE ARTIEDA
*
* Licensed under the EUPL, Version 1.1 or – as soon they
will be approved by the European Commission - subsequent
versions of the EUPL (the "Licence");
* You may not use this work except in compliance with the
Licence.
* You may obtain a copy of the Licence at:
*
* https://joinup.ec.europa.eu/software/page/eupl5
*
* Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
* See the Licence for the specific language governing
permissions and limitations under the Licence.
*/
var myCap;
var leftArrow;
var rightArrow;
var levels;
var histoclose;
var histo_p;

(function() {

    Snap.plugin(function(Snap, Element, Paper, global) {
        var startDragTarget, startDragElement, startBBox, startScreenCTM;

        // Initialise our slider with its basic transform and drag funcs
        Element.prototype.initSlider = function(params) {
            var emptyFunc = function() {};
            this.data('origTransform', this.transform().local);
            this.data('onDragEndFunc', params.onDragEndFunc || emptyFunc);
            this.data('onDragFunc', params.onDragFunc || emptyFunc);
            this.data('onDragStartFunc', params.onDragStartFunc || emptyFunc);
        }

        // initialise the params, and set up our max and min. Check if its a slider or knob to see how we deal
        Element.prototype.sliderAnyAngle = function(params) {
            this.initSlider(params);
            this.data("maxPosX", params.max);
            this.data("minPosX", params.min);
            this.data("centerOffsetX", params.centerOffsetX);
            this.data("centerOffsetY", params.centerOffsetY)
            this.data("posX", params.min);
            if (params.type == 'knob') {
                this.drag(moveDragKnob, startDrag, endDrag);
            } else {
                this.drag(moveDragSlider, startDrag, endDrag);
            }
        }

        // load in the slider svg file, and transform the group element according to our params earlier.
        // Also choose which id is the cap
        Paper.prototype.slider = function(params,cb) {
            var myPaper = this,
                myGroup;
            var loaded = Snap.load(params.filename, function(frag) {
                myGroup = myPaper.group().add(frag);
                myGroup.transform("t" + params.x + "," + params.y);
                myCap = myGroup.select(params.capSelector);
                myCap.data("sliderId", params.sliderId);
                myCap.sliderAnyAngle(params);
                sliderSetAttributes(myGroup, params.attr);
                sliderSetAttributes(myCap, params.capattr);
                myCap.getPos = function (fraq) {
                    return this.data("fracX");
                };
                myCap.setPos = function (fraq) {
                    this.data("posX", fraq * (this.data("maxPosX") - this.data("minPosX") ));
                    this.data("fracX", fraq);
                    var posX = this.data("posX");
                    this.attr({
                        transform: this.data("origTransform") + (posX ? "T" : "t") + [posX, 0]
                    });
                }
                cb();
            });
            return myGroup;
        }

        // Extra func, to pass through extra attributes passed when creating the slider

        function sliderSetAttributes(myGroup, attr, data) {
            var myObj = {};
            if (typeof attr != 'undefined') {
                for (var prop in attr) {
                    myObj[prop] = attr[prop];
                    myGroup.attr(myObj);
                    myObj = {};
                };
            };
        };

        // Our main slider startDrag, store our initial matrix settings.

        var startDrag = function(x, y, ev) {
            startDragTarget = ev.target;
            if (!(this.data("startBBox"))) {
                this.data("startBBox", this.getBBox());
                this.data("startScreenCTM", startDragTarget.getScreenCTM());
            }
            this.data('origPosX', this.data("posX"));
            this.data('origPosY', this.data("posY"));
            this.data("onDragStartFunc")();
        }


        // move the cap, our dx/dy will need to be transformed to element matrx. Test for min/max
        // set a value 'fracX' which is a fraction of amount moved 0-1 we can use later.

        function updateMovement(el, dx, dy) {
            // Below relies on parent being the file svg element, 9
            var snapInvMatrix = el.parent().transform().globalMatrix.invert();
            snapInvMatrix.e = snapInvMatrix.f = 0;
            var tdx = snapInvMatrix.x(dx, dy),
                tdy = snapInvMatrix.y(dx, dy);

            el.data("posX", +el.data("origPosX") + tdx);
            el.data("posY", +el.data("origPosY") + tdy);
            var posX = +el.data("posX"); //var posY = +el.data("posY");
            var maxPosX = +el.data("maxPosX");
            var minPosX = +el.data("minPosX");

            if (posX > maxPosX) {
                el.data("posX", maxPosX);
            };
            if (posX < minPosX) {
                el.data("posX", minPosX);
            };
            el.data("fracX",  el.data("posX")/(maxPosX - minPosX) );
        }

        // Call the matrix checks above, and set any transformation
        function moveDragSlider(dx, dy) {
            var posX;
            updateMovement(this, dx, dy);
            posX = this.data("posX");
            this.attr({
                transform: this.data("origTransform") + (posX ? "T" : "t") + [posX, 0]
            });
            this.data("onDragFunc")(this);
        };

        // drag our knob. Currently there is no min/max working, need to add a case for testing rotating anticlockwise beyond 0
        /*function moveDragKnob(dx, dy, x, y, ev) {
            var pnt = startDragTarget.ownerSVGElement.createSVGPoint();
            pnt.x = ev.clientX;
            pnt.y = ev.clientY;
            var vPnt = pnt.matrixTransform(this.data("startScreenCTM").inverse());
            var transformRequestObj = startDragTarget.ownerSVGElement.createSVGTransform();

            var deg = Math.atan2(vPnt.x - this.data("startBBox").cx, vPnt.y - this.data("startBBox").cy) * 180 / Math.PI;
            deg = deg + 180;
            //              this.transform('r' + -deg + "," + ( this.data("startBBox").cx - 4 ) + "," + parseInt(this.data("startBBox").cy - -8)  );
            this.transform('r' + -deg + "," + (this.data("startBBox").cx - this.data("centerOffsetX")) + "," + parseInt(this.data("startBBox").cy - -this.data("centerOffsetY")));
            this.data("fracX", deg / 360);
            this.data("onDragFunc")(this);
        }*/

        function endDrag() {
            this.data('onDragEndFunc')(this);
        };

    });

})();

var Histogram = function() {

    this.scale = 0.1;
    this.onclick = function(e) {};
    this.s = Snap("#histo");
    //this.draw();
    //this.drawTable();
    this.selection = [];
};

Histogram.prototype.setData = function(n) {
    this.data = n;

}

Histogram.prototype.myDragStartFunc = function(ev) {
    console.log("drag start");
}
Histogram.prototype.myDragEndFunc = function(ev) {
    console.log("dragend");
    var p = ev.data("posX");
    p = Math.exp(p * Math.log(255.0) / 255.0);
    //FIXME GUARRERIA SUPREMA
    var bin = m_hexcel.data.min + (m_hexcel.data.max - m_hexcel.data.min) * p / 256.0;
    console.log("min:"+m_hexcel.data.min+" max:"+m_hexcel.data.max)
    console.log(bin);

    set_img_scale(m_hexcel.data.min, bin);
}
Histogram.prototype.draw = function() {
    console.log("drawin histo!");
    var points = [];
    var maxtop = 0;
    var s = this.s;
    for (var i = 0; i < this.data.buckets.length; i++) {
        points[2 * i] = Math.log(i + 1);
        points[2 * i + 1] = Math.log(this.data.buckets[i]+1);
        if (points[2 * i + 1] > maxtop) maxtop = points[2 * i + 1];
    }
    points.push(Math.log(this.data.buckets.length));
    points.push(0);
    points.push(0);
    points.push(0);
    for (var i = 1; i < points.length; i = i + 2) {
        points[i] = 100 - (points[i] * 100 / maxtop);
        points[i - 1] = points[i - 1] * 255.0 / Math.log(255);
    }
    histo_p = s.polygon(points).attr({
        fill: "#ffffff",
        "fill-opacity": 0.4,
        stroke: "#000",
        strokeWidth: 1
    });
    var scaley = 100.0 / maxtop
    var t = new Snap.Matrix();
    t.scale(1);
    var h = this;
    histo_p.transform(t);

    histo_p.attr({
        visibility: "hidden"
    });

    this.slider2 = s.slider({
        sliderId: "slider2",
        capSelector: "#arrow",
        filename: "images/arrow.svg",
        x: "0",
        y: "80",
        min: "0",
        max: "256",
        onDragEndFunc: this.myDragEndFunc,
        onDragStartFunc: this.myDragStartFunc,
        onDragFunc: this.myDragFunc
    },function(){
      console.log("setting knob init pos");
      myCap.setPos(0.3);
      //m_hexcel.myDragEndFunc(myCap);
      myCap.attr({
          visibility: "hidden"
      });
    });

      Snap.load("images/arrow2.svg", function(frag) {
        leftArrow = s.group().add(frag);
        leftArrow.transform( 'r-90,0,0' );
        var t = new Snap.Matrix();
        t.translate(0, 40);
        t.add(leftArrow.transform().localMatrix);
        leftArrow.transform(t);
        leftArrow.click(function () {
            myCap.setPos(myCap.getPos()-0.1);
            m_hexcel.myDragEndFunc(myCap);
        });
        leftArrow.attr({
            visibility: "hidden"
        });

     })
      Snap.load("images/arrow2.svg", function(frag) {
        rightArrow = s.group().add(frag);
        rightArrow.transform( 'r90,10,-15' );
        var t = new Snap.Matrix();
        t.translate(256, 40);
        t.add(rightArrow.transform().localMatrix);
        rightArrow.transform(t);
        rightArrow.click(function () {
            myCap.setPos(myCap.getPos()+0.1);
            m_hexcel.myDragEndFunc(myCap);
        });
        rightArrow.attr({
            visibility: "hidden"
        });

    })

     Snap.load("images/levels.svg", function(frag) {
        levels = s.group().add(frag);
        levels.transform( 't0,0' );
        levels.click(function () {
          myCap.attr({
              visibility: "visible"
          });
          leftArrow.attr({
              visibility: "visible"
          });
          rightArrow.attr({
              visibility: "visible"
          });
          histo_p.attr({visibility:"visible"});
          histoclose.attr({
              visibility: "visible"
          });
          levels.attr({
              visibility: "hidden"
          });
          $("#nuevo_reto_button").hide();
          $("#search_button").hide();
        });
    })
    Snap.load("images/close.svg", function(frag) {
        histoclose = s.group().add(frag);
        histoclose.transform( 't256,0' );
        histoclose.click(function () {
          myCap.attr({
              visibility: "hidden"
          });
          leftArrow.attr({
              visibility: "hidden"
          });
          rightArrow.attr({
              visibility: "hidden"
          });
          histoclose.attr({
              visibility: "hidden"
          });
          histo_p.attr({visibility:"hidden"});
          levels.attr({
              visibility: "visible"
          });
          $("#nuevo_reto_button").show();
          $("#search_button").show();

        });
        histoclose.attr({
            visibility: "hidden"
        });

    })


    return ;
};
