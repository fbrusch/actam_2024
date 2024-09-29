# a list is an object.
# what method can i use?


# definition of functions to capture sections and play with them

def fm1
  [60, 62, 64, 60].each do |nota|
    # a block of instructions
    play nota
    sleep 0.5
  end
  puts "barr 1"
end

# another way to use blocks is with {}
def fm2
  [64, 65].each { |nota| play nota; sleep 0.5}
  play 67
  sleep 1
  puts "barr 2"
end

def fm3
  [67, 69, 67, 65, 64].each { |nota| play nota; sleep 0.25 }
  sleep 0.25
  play 60
  sleep 0.5
  puts "barr 3"
end

def fm4
  [60, 55].each { |n| play n; sleep 0.5}
  play 60
  sleep 1
  puts "barr 4"
end




# define a list
whole_song = [:fm1, :fm2, :fm3, :fm4]

#2.times { send(whole_song[0]) }


##### use threads
in_thread do
  loop { send(whole_song.sample)}
end

# let's add some groove
in_thread do
  loop do
    sample :bd_klub
    sleep 0.25
    sample :drum_cymbal_closed
    sleep 0.25
  end# samples are symbols in ruby
end

















