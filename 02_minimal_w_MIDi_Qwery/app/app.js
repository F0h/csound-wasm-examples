function sendEventToCsoundFromQwerty(id,ninstr){
    var qwerty = document.getElementById(id);  
    qwerty.addEventListener('change', function(e) {
        nKey = e.note[1]+60;
        nVel = e.note[0];
        var freq = noteNumberToFreq(nKey);
        if (nVel == 0){
            csound.inputMessage("i -" + ninstr +"." + (e.note[1]+1)  + " 0" + " -1 "+ freq + " " + nVel );
        }     
        csound.inputMessage("i " + ninstr +"." + (e.note[1]+1)  + " 0" + " -1 "+ freq + " " + nVel*.2 );
        console.log(nKey, freq)
      })
        
}
function noteNumberToFreq(nKey){
   
    return  440 * Math.pow(2,(nKey-69)/12);
 }


var nKey=0, nVel=1;        //Para la función Qwerty


// /////////////////////////////////////////////////////
 var engine = document.getElementById('start');
 engine.addEventListener('click', startEngine);

function startEngine() {

    engine.style.display = 'none';
    /////////// hlolli library ////////////////
    csound.enableMidi();
    csound.playCSD(helloCsound); // Use this or csound.realTime(CSD)
    csound.inputMessage("i 1 0 .25 880 .2"); //test CSD
    ///////////////////////////////////
    sendEventToCsoundFromQwerty('querty', '1');
}


////////// CSD FILE ////////
const helloCsound =
`   
;;;;;;; csd ;;;;;;;;;;;;;;
<CsoundSynthesizer>
<CsOptions>
-n -d -+rtmidi=NULL -M0 -m0d --midi-key-cps=4 --midi-velocity-amp=5
</CsOptions>
<CsInstruments>
        massign 0, 1 ;all MIDI channell for instrument 1
; Initialize the global variables. 
ksmps = 32
nchnls = 2
0dbfs = 1

;instrument will be triggered by keyboard widget
        instr 1
kAEG    madsr .01, .001, .8, .01
a1      oscili  p5 * kAEG   ,   p4
        outs    a1          ,   a1
        endin

</CsInstruments>
<CsScore>
;causes Csound to run for about 7000 years...
f0 z
</CsScore>
</CsoundSynthesizer>

;;;;;;;;;;;;;;;;;;;;;;;;;
`


