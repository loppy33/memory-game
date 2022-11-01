import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageNames: [],
      blank: './images/blank/blank.png',
      blocked: '',
      cards: [],
      counter: 0,
      wins_counter: 0,
    }
  }

  componentDidMount() {
    let imageNames = [];
    for (let i = 0; i < 12; i++) {
      imageNames.push(i + '.jpg')
      imageNames.push(i + '.jpg')
    }

    for (let i = imageNames.length - 1; i > 0; i--) {
      // Миксуем массив с именами картинок так чтоб не повторялись 
      let randomNumber = Math.floor(Math.random() * (i + 1))
      let current = imageNames[i]
      imageNames[i] = imageNames[randomNumber]
      imageNames[randomNumber] = current
    }

    this.setState({
      imageNames: imageNames,
    })
  }

  onDrag(e) {
    e.preventDefault();
  }

  openImage(e, image) {
    let blank = this.state.blank
    e.target.src = './images/icons/' + image
    this.setState(function (state) {
      let cards = state.cards;

      if (cards.length > 0) {
        if (cards[0] !== e.target) {
          cards.push(e.target)
        }
      } else {
        cards.push(e.target)
      }
      return {
        cards: cards,
      }
    }, function () {
      if (this.state.cards.length === 2) {
        let counter = this.state.counter

        this.setState({
          counter: counter + 1,
        })
        let cards = this.state.cards
        if (cards[0].src === cards[1].src) {
          let wins_counter = this.state.wins_counter
          cards[0].style.pointerEvents = 'none';
          cards[1].style.pointerEvents = 'none';
          this.setState({
            cards: [],
            wins_counter: wins_counter + 1
          }, () => {
            console.log(this.state.wins_counter);
          })
        }
        else {
          this.setState({
            blocked: 'blocked'
          })

          // setTimeout используем стречлочную функцию для вызова setState !
          setTimeout(() => {
            cards[0].src = blank
            cards[1].src = blank
            this.setState({
              cards: [],
              blocked: ''
            })
          }, 1000)
        }
      }
    })
  }

  shuffle() {
    this.setState({
      blocked: '',
      cards: [],
      counter: 0,
      wins_counter: 0,
    })

    this.setState(function (state) {
      let imageNames = state.imageNames;

      for (let i = imageNames.length - 1; i > 0; i--) {
        // Миксуем массив с именами картинок так чтоб не повторялись 
        let randomNumber = Math.floor(Math.random() * (i + 1))
        let current = imageNames[i]
        imageNames[i] = imageNames[randomNumber]
        imageNames[randomNumber] = current
      }

      return {
        imageNames: imageNames,
      }
    })

    let cards = document.getElementsByTagName('img')
    for (let card of cards) {
      card.src = this.state.blank
      card.style.pointerEvents = 'auto'
    }
  }

  render() {
    let win;
    if (this.state.wins_counter === 12) {
      win = <h1>Победа!</h1>
    }
    else {
      win = <h1>Запомни картинку</h1>
    }

    let title;
    if (this.state.counter === 0) {
      title = <h2>Удачи!</h2>
    }
    else {
      title = <h2>Кликов: {this.state.counter}</h2>
    }

    return (
      <div className='game'>
        {win}
        {title}
        <div className="cards">
          {
            this.state.imageNames.map((image, id) => (
              <img className={this.state.blocked} onDragStart={(e) => this.onDrag(e)} key={id} src={this.state.blank} alt="" onClick={(e) => this.openImage(e, image)} />
            ))
          }
        </div>
        <button onClick={() => this.shuffle()} className='shufle'>Перемешать</button>
      </div>
    )
  }
}

export default App;


// TODO Сделать чтоб в конце игры при победе выводилось количество шагов (кликов)
// и кнопку перезапуска игры (начать заново)