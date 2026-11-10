// Per-prompt tier shaping, modelled on how Krillion splits its answers:
// a handful of top-of-mind answers (top), and exactly one hand-picked Krillion with a fact (k).
window.TIERFIX = Object.assign(window.TIERFIX || {}, {
  countries: { top: ['United States', 'China', 'France', 'Canada', 'Japan'], k: ['Nauru', 'The smallest island nation on Earth, and one with no official capital city.'] },
  elements: { top: ['Hydrogen', 'Oxygen', 'Gold', 'Carbon', 'Helium'], k: ['Ytterbium', 'One of four elements named after the same Swedish village, Ytterby.'] },
  states: { top: ['California', 'Texas', 'Florida', 'New York', 'Hawaii'], k: ['Delaware', 'The first state to ratify the US Constitution, in December 1787.'] },
  sea: { top: ['Shark', 'Whale', 'Dolphin', 'Octopus', 'Jellyfish'], k: ['Barreleye', 'This fish has a see-through head and can swivel its eyes to look straight up through it.'] },
  dogs: { top: ['Labrador', 'Golden Retriever', 'German Shepherd', 'Poodle', 'Bulldog'], k: ['Norwegian Lundehund', 'Bred to climb cliffs after puffins, it has six toes on every foot.'] },
  fruits: { top: ['Apple', 'Banana', 'Orange', 'Strawberry', 'Grape'], k: ['Miracle fruit', 'After eating one berry, lemons and vinegar taste sweet for a while.'] },
  vegetables: { top: ['Carrot', 'Potato', 'Broccoli', 'Lettuce', 'Onion'], k: ['Skirret', 'A sweet white root that Tudor cooks prized before the potato pushed it aside.'] },
  instruments: { top: ['Guitar', 'Piano', 'Drums', 'Violin', 'Flute'], k: ['Glass harmonica', 'Benjamin Franklin invented it in 1761, and Mozart wrote music for it.'] },
  sports: { top: ['Soccer', 'Basketball', 'Baseball', 'Tennis', 'Golf'], k: ['Buzkashi', 'The national sport of Afghanistan: riders on horseback fight over a goat carcass.'] },
  capitals: { top: ['London', 'Paris', 'Washington', 'Tokyo', 'Rome'], k: ['Ngerulmud', 'The capital of Palau is home to only a few hundred people.'] },
  birds: { top: ['Eagle', 'Owl', 'Parrot', 'Penguin', 'Pigeon'], k: ['Hoatzin', 'Its chicks hatch with claws on their wings and use them to climb trees.'] },
  code: { top: ['Python', 'JavaScript', 'Java', 'C++', 'C'], k: ['Malbolge', 'Built in 1998 to be nearly impossible to use. Its first working program was found by a computer search.'] },
  shakespeare: { top: ['Romeo and Juliet', 'Hamlet', 'Macbeth'], k: ['The Two Noble Kinsmen', 'Co-written with John Fletcher, and probably the last play he worked on.'] },
  spices: { top: ['Pepper', 'Cinnamon', 'Basil', 'Garlic', 'Oregano'], k: ['Grains of paradise', 'A West African seed that medieval Europe used as a cheaper stand-in for black pepper.'] },
  cars: { top: ['Toyota', 'Ford', 'Honda', 'BMW', 'Tesla'], k: ['Tucker', 'Only 51 Tucker 48s were built before the company collapsed in 1949.'] },
  mammals: { top: ['Dog', 'Cat', 'Lion', 'Tiger', 'Elephant'], k: ['Saola', 'Discovered in Vietnam in 1992 and so rarely seen that it is nicknamed the Asian unicorn.'] },
  cheese: { top: ['Cheddar', 'Mozzarella', 'Parmesan', 'Swiss', 'American'], k: ['Pule', 'Made in Serbia from donkey milk, and often called the most expensive cheese in the world.'] },
  money: { top: ['Dollar', 'Euro', 'Pound', 'Yen', 'Peso'], k: ['Cowrie', 'These sea-snail shells were spent as money across Africa and Asia for centuries.'] },
  trees: { top: ['Oak', 'Pine', 'Maple', 'Palm', 'Willow'], k: ['Wollemi pine', 'Known only from fossils until living trees were found near Sydney in 1994.'] },
  languages: { top: ['English', 'Spanish', 'French', 'German', 'Chinese'], k: ['Silbo Gomero', 'A whistled form of Spanish, used to talk across the ravines of La Gomera.'] },
});
