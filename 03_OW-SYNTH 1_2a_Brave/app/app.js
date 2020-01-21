function SeleccionId(id){
    valor = document.getElementById(id).value
    return valor;
} 

function checkboxIsChecked(id){
    valor = document.getElementById(id).checked
    return valor;
}
function webComponentIdToValorPerillaPortTime1(id){
    var perilla = document.getElementById(id);
    perilla.addEventListener('input', function(e) {
        portTime1 = e.target.value
      });
}
function webComponentIdToValorPerillaVol1(id){
    var perilla = document.getElementById(id);
    perilla.addEventListener('input', function(e) {
        vol1 = e.target.value
      });
}
function webComponentIdToValorPerillaPan1(id){
    var perilla = document.getElementById(id);
    perilla.addEventListener('input', function(e) {
        pan1 = e.target.value
      });
}
function webComponentIdToValorQwerty(id){
    var qwerty = document.getElementById(id);
    qwerty.addEventListener('change', function(e) {
        nKey = e.note[1];
        nVel = e.note[0];
      })
}
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

////////////////////////////
//      - main -         //
//////////////////////////

let nKey=0, nVel=0;
let portTime1 = 0.0;
let vol1=0.6;
let pan1 = 0.5;
webComponentIdToValorPerillaPortTime1("portTime1");
webComponentIdToValorPerillaVol1("vol1");
webComponentIdToValorPerillaPan1("pan1");
//webComponentIdToValorQwerty("qwerty");
/// Teclado qwerty si hay un cambio envia un mensaje al instr 1 ///
csound.inputMessage("i 306 2 .25 990 .2");
sendEventToCsoundFromQwerty('qwerty',306);



////////// CSD FILE ///////////////////
const OW_Synth = 
`   
<CsoundSynthesizer>
<CsOptions>
-n -d -+rtmidi=NULL -M0 -m0d --midi-key-cps=4 --midi-velocity-amp=5
</CsOptions>
<CsInstruments>

massign   -1, 306 ;assign all MIDI channels to instrument 306    

;;;;;;;;;;;; GLOBAL VARIABLES;;;;;;;;;
gif1    ftgen   1,0,8192,10,1;sine
gif2    ftgen   2,0,8192, 7,-1,4096,1,4096,-1;tri
gif3    ftgen   3,0,8192, 7,1,4096,1,0,-1,4096,-1;sqr
gif4    ftgen   4,0,8192, 7,1, 2048,1,0,-1;pulse
gif5    ftgen   5,0,8192, 7,1,8192,-1;rampa
gif6    ftgen   6,0,8192, 7,-1,8192,1;saw


;;;;;; waveform selector ;;;;;;
giwf    init 1;

;;;tuner;;
gkfine    init 1;
gkcoarse  init 1;
gkrange   init 1;
;;; portamento;;;
gioldNote   init 261.626
giNote       init 261.626
giVel       init 0
giNewKey    init 60
giPortSw    init 0
giPortTime1  init 0.25
;;; Teclado qwerty
gknKey     init 60
gknVel     init  1

;;;;;;;;;;; querty     ;;;;;;;;;;;;;;;;;;;;;;;


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        instr 306

giwf        chnget  "wf1"
kwfSw1      chnget  "swOsc1"
kkbtrk1     chnget  "kbtrk1"
gkfine      chnget  "fine1"
gkcoarse    chnget  "coarse1"
gkrange     chnget  "range1"
kPortSw1     chnget  "portSw1"
giPortTime1  chnget  "portTime1"
kVol1       chnget  "vol1"
kPan1       chnget  "pan1"
kfreq       init    261.62
ktuner   = pow(2, (gkfine + gkcoarse + gkrange*12) * .083); 
;;portamento
gioldNote = giNote
giNote     = p4
irateFq  = pow(2,  octcps(giNote) - octcps(gioldNote) ) 
kport   linseg   gioldNote, giPortTime1, giNote 

;;;; Temporal AEG  Declick
kAEG    madsr  .005, .001, 1, .1








;;;;keyboard Tracker
if kkbtrk1 == 1 then
kcps = 440
else
kcps = k(p4) 
endif

;;Select Waveform
if giwf == 7 then
a1          rand  p5 * kAEG
aqwerty     rand  p5 * kAEG
else
;a1     oscili  p5 * kAEG ,(kPortSw1==1? kport: kcps)  * ktuner  , giwf


;aqwerty oscili iampQwerty * kAEG, (kPortSw1==1? kport: iFqQwerty) * ktuner, giwf
a1      oscili p5 * kAEG, (kPortSw1==1? kport: kcps) * ktuner, giwf
endif



aMIDIL  = ( a1 * kwfSw1 * kVol1 ) * (1 - kPan1) 
aMIDIR  = ( a1  * kwfSw1 * kVol1 ) *  kPan1      

aTL     sum  aMIDIL
aTR     sum  aMIDIR
        outs  aTL  , aTR
        endin



</CsInstruments>
<CsScore>
;causes Csound to run for about 7000 years...
f0 z

</CsScore>
</CsoundSynthesizer>

   
;schedule(306, 0, -1)`;


    csound.enableMidi();
    csound.startRealtime();
    csound.playCSD(OW_Synth);


    const updateCsound = () => { 
        
         csound.setControlChannel("wf1", SeleccionId("wf1") );
         csound.setControlChannel("swOsc1", checkboxIsChecked("swOsc1") );
         csound.setControlChannel("kbtrk1", checkboxIsChecked("kbtrk1") ); 
         csound.setControlChannel("portSw1", checkboxIsChecked("portSw1") ); 
         csound.setControlChannel("portTime1", portTime1 );

         csound.setControlChannel("range1", SeleccionId("range_1") );
         csound.setControlChannel("coarse1", SeleccionId("coarse_1") );
         csound.setControlChannel("fine1", SeleccionId("fine_1") ); 

         csound.setControlChannel("vol1", vol1 );
         csound.setControlChannel("pan1", pan1 );
        //  csound.setControlChannel("nKey", nKey );
        //  csound.setControlChannel("nVel", nVel );
        

    }
    csound.on("perform", updateCsound);

   

   