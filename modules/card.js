const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'card.json'
)

class Card {
  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(p, 'utf-8', (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(content));
        }
      })
    })

  }
  static async add(course) {
    const card = await Card.fetch();
    const candidateIndex = card.courses.findIndex(item => item.id === course.id);
    const candidate = card.courses[candidateIndex];
    if (candidate) {
      candidate.count++;
      card.courses[candidateIndex] = candidate;
    } else {
      course.count = 1;
      card.courses.push(course);
    }

    card.price += +course.price;

    return new Promise(((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(card), err => {
        if (err) {
          reject(err)
        } else {
          resolve();
        }
      })
    }))
  }


}

module.exports = Card;