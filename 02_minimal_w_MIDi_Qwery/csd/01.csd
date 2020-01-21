
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
