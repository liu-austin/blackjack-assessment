import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { render } from "@testing-library/react";
import axios from "axios";
import Card from "./components/card";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deck_id: null,
      player_cards: [],
      dealer_cards: [],
      player_score: 0,
      dealer_score: 0,
      turn: 0,
      player_wins: 0,
      player_losses: 0,
      player_ties: 0
    };
  }

  playAgain() {
    this.setState({player_cards: [], dealer_cards: [], player_score: 0, dealer_score: 0, turn: 0}, () => {
            axios
              .get(
                `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=2`
              )
              .then(res1 => {
                if (res1.data) {
                  let value = 0;
                  let cardUrls = [];
                  res1.data.cards.forEach(card => {
                    if (card.value === "ACE") {
                      if (this.state.player_score + value > 10) {
                        value += 1;
                      } else {
                        value += 11;
                      }
                    } else if (["JACK", "QUEEN", "KING"].includes(card.value)) {
                      value += 10;
                    } else {
                      value += Number(card.value);
                    }
                    cardUrls.push(card);
                  });
                  this.setState(
                    { player_score: value, player_cards: cardUrls },
                    () => {
                      axios
                        .get(
                          `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=2`
                        )
                        .then(res2 => {
                          if (res2.data) {
                            let value = 0;
                            let cardUrls = [];
                            res2.data.cards.forEach(card => {
                              if (card.value === "ACE") {
                                if (this.state.dealer_score + value > 10) {
                                  value += 1;
                                } else {
                                  value += 11;
                                }
                              } else if (
                                ["JACK", "QUEEN", "KING"].includes(card.value)
                              ) {
                                value += 10;
                              } else {
                                value += Number(card.value);
                              }
                              cardUrls.push(card);
                            });
                            this.setState({
                              dealer_score: value,
                              dealer_cards: cardUrls
                            });
                          }
                        });
                    }
                  );
                }
              });

    });
  }

  checkBust() {
    if (this.state.player_score > 21) {
      this.setState({player_losses: this.state.player_losses + 1}, () => {
        this.playAgain();
        return true;
      });
    } else if (this.state.dealer_score > 21) {
      this.setState({player_wins: this.state.player_wins + 1}, () => {
        this.playAgain();
        return true;
      });
    }
    return false;
  }

  compareScores() {
    if (this.state.player_score === this.state.dealer_score) {
      this.setState({player_ties: this.state.player_ties + 1}, () => {
        this.playAgain();
      });
    } else if (this.state.player_score > this.state.dealer_score) {
      this.setState({player_wins: this.state.player_wins + 1}, () => {
        this.playAgain();
      });
    } else {
      this.setState({player_losses: this.state.player_losses + 1}, () => {
        this.playAgain();
      });
    }
  }

  calculateScore(playerHand) {
    let value = 0;
    let aces = 0;
    playerHand.forEach(playerCard => {
      if (playerCard.value === "ACE") {
        aces += 1;
        value += 1;
      } else if (["JACK", "QUEEN", "KING"].includes(playerCard.value)) {
        value += 10;
      } else {
        value += Number(playerCard.value);
      }
    });
    while (value <= 11 && aces) {
      value += 10;
    }
    return value;
  }



  componentDidMount() {
    axios
      .get(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`)
      .then(results => {
        if (results.data) {
          this.setState({ deck_id: results.data.deck_id }, () => {
            axios
              .get(
                `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=2`
              )
              .then(res1 => {
                if (res1.data) {
                  let value = 0;
                  let cardUrls = [];
                  res1.data.cards.forEach(card => {
                    if (card.value === "ACE") {
                      if (this.state.player_score + value > 10) {
                        value += 1;
                      } else {
                        value += 11;
                      }
                    } else if (["JACK", "QUEEN", "KING"].includes(card.value)) {
                      value += 10;
                    } else {
                      value += Number(card.value);
                    }
                    cardUrls.push(card);
                  });
                  this.setState(
                    { player_score: value, player_cards: cardUrls },
                    () => {
                      axios
                        .get(
                          `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=2`
                        )
                        .then(res2 => {
                          if (res2.data) {
                            let value = 0;
                            let cardUrls = [];
                            res2.data.cards.forEach(card => {
                              if (card.value === "ACE") {
                                if (this.state.dealer_score + value > 10) {
                                  value += 1;
                                } else {
                                  value += 11;
                                }
                              } else if (
                                ["JACK", "QUEEN", "KING"].includes(card.value)
                              ) {
                                value += 10;
                              } else {
                                value += Number(card.value);
                              }
                              cardUrls.push(card);
                            });
                            this.setState({
                              dealer_score: value,
                              dealer_cards: cardUrls
                            });
                          }
                        });
                    }
                  );
                }
              });
          });
        }
      });
  }

  render() {
    return (
      <>
      <div style={{ textAlign: "center" }}>
      <p>Wins, Losses, Ties</p>

      <div>Player Wins:</div>
      <div>{this.state.player_wins}</div>

      <br />
      <div>Player Losses:</div>
      <div>{this.state.player_losses}</div>
      <br />
      <div>Player Ties:</div>
      <div>{this.state.player_ties}</div>
    </div>
        <div style={{ textAlign: "center" }}>
          <p>Deal or Pass</p>
          <button
            onClick={() => {
              if (!this.state.turn) {
                axios
                  .get(
                    `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=1`
                  )
                  .then(results => {
                    if (results.data) {
                      let cardUrls = [];
                      results.data.cards.forEach(card => {
                        cardUrls.push(card);
                      });
                      let totalCards = this.state.player_cards.concat(cardUrls);
                      let handValue = this.calculateScore(totalCards);
                      this.setState({
                        player_score: handValue,
                        player_cards: totalCards
                      }, () => {
                        this.checkBust();
                      });
                    }
                  });
              }
            }}
          >
            Deal
          </button>
          <button
            onClick={() => {
              if (!this.state.turn) {
                this.setState({ turn: 1 }, () => {
                  while (this.state.dealer_score > 16) {
                    axios
                      .get(
                        `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=1`
                      )
                      .then(results => {
                        if (results.data) {
                          let cardUrls = [];
                          results.data.cards.forEach(card => {
                            cardUrls.push(card);
                          });
                          let totalCards = this.state.dealer_cards.concat(cardUrls);
                          let handValue = this.calculateScore(totalCards);
                          this.setState({
                            dealer_score: handValue,
                            dealer_cards: totalCards
                          });
                        }
                      });
                  }
                  if (!this.checkBust()) {
                    this.compareScores();
                  }
                });
              }
            }}
          >
            Pass
          </button>
        </div>
        <div style={{ textAlign: "center" }}>
          <p>Scores</p>

          <div>Player Score:</div>
          <div>{this.state.player_score}</div>

          <br />
          <div>Dealer Score:</div>
          <div>{this.state.dealer_score}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div>Player Cards:</div>
          <div>
            {this.state.player_cards.length
              ? this.state.player_cards.map((player_card, i) => {
                  return <Card key={i} image={player_card.image} />;
                })
              : null}
          </div>

          <br />
          <div>Dealer Cards:</div>
          <div>
            {this.state.dealer_cards.length
              ? this.state.dealer_cards.map((dealer_card, i) => {
                  return <Card key={i} image={dealer_card.image} />;
                })
              : null}
          </div>
        </div>
      </>
    );
  }
}

export default App;
