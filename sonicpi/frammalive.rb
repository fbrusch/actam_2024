## My var
$fmAmp = 1.5;

## My functions

def myarp(att)
  [65, 55, 64].each do |nota|
    play nota
    sleep 0.25
  end
  play 55, attack: att, sustain: 0.5
  sleep 1
end


def fm1
  [60, 62, 64, 60].each do |nota|
    play nota, amp: $fmAmp
    sleep 0.5
  end
end


def fm2
  [64, 65].each do |nota|
    play nota;
    sleep 0.5
  end
  
  play 67, amp: $fmAmp, sustain: choose([1, 3])
  sleep 1
end

def fm3
  [67, 69, 67, 65, 64].each do |nota|
    play nota, amp: $fmAmp
    sleep 0.25
  end
  sleep 0.25
  play 60
  sleep 0.5
end


def fm4
  [60, 55].each { |nota| play nota, amp: $fmAmp;  sleep 0.5}
  play 60, amp: $fmAmp
  sleep 1
end


## My loops
live_loop :layer1 do
  cue :bass
  use_synth :bass_highend
  #sample :bass_drop_c
  play choose([60, 55]), attack: 0.5
  sleep 0.25
end

live_loop :arp do
  sync :bass  # Waits for the :bass cue to trigger
  use_synth :bass_foundation
  myarp 0#1.5
end

live_loop :boom do
  sync :bass
  
  sample :bd_fat, amp: 10, sustain: 1
  sleep 2
  sample :bd_mehackit, amp: 9
  sleep 1
end


live_loop :framma do
  sync :bass
  
  use_synth :winwood_lead
  fm1
  fm2
  fm3
  fm3
  fm4
  fm4
end

live_loop :multi_beat do
  sync :framma
  
  use_random_seed 666
  8.times do
    sample :elec_hi_snare, amp: 2 if one_in(4)
    sample :drum_cymbal_closed if one_in(2)
    sample :drum_cymbal_pedal if one_in(3)
    sample :bd_haus, amp: 5 if one_in(2)
    sleep 0.125
  end
end

live_loop :mykick do
  sync :bass
  
  sample :bd_haus, amp: 5
  sleep 0.25
  sample :drum_cymbal_closed, amp: 2
  sleep 0.25
end
