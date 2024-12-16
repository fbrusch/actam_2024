

// POT INPUT
int potPin = A0; 
int potVal = 0; 

// RADAR
int radarPin = 2; 
int radarState = LOW;
int radarVal = 0;

// ULTRASONIC
int trigPin = 9;
int echoPin = 10;
float duration, dist;

void setup()
{
  pinMode(radarPin, INPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600); 
}


void loop()
{
  potVal = analogRead(potPin);   // read the potentiometer value at the input pin
  radarVal = digitalRead(radarPin);

  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  dist = (duration*.0343)/2;

  Serial.print(potVal);
  Serial.print(" ");
  Serial.print(radarVal);
  Serial.print(" ");
  Serial.print(dist);
  Serial.println();

  delay(50);
}
