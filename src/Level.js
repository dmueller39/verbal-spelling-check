// @flow
import * as React from "react";

import {
  Button,
  Slider,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  View,
  Platform,
} from "react-native";
import WebKeyboardListener from "./common/WebKeyboardListener";
import type { VerbalGame, VerbalGameResult } from "./types";
import LabelButton from "./common/LabelButton";
import Container from "./common/Container";

export type Props = {|
  onComplete: (VerbalGameResult) => void,
  game: VerbalGame,
|};

type State = {
  currentIndex: number,
  mistakes: number,
  isShowingAnswer: boolean,
  isCorrect: boolean,
};

function InputElement({
  type,
  disabled,
  onPress,
  buttonLabel,
  inputKey,
}: {
  type: "positive" | "negative",
  buttonLabel: string,
  disabled: boolean,
  onPress: () => void,
  inputKey: string,
}) {
  return (
    <View style={styles.inputContainer}>
      <LabelButton
        disabled={disabled}
        label={buttonLabel}
        type={type}
        onPress={onPress}
      />
      <WebKeyboardListener inputKey={inputKey} onKeyPress={onPress}>
        <Text>({inputKey})</Text>
      </WebKeyboardListener>
    </View>
  );
}

export default class Menu extends React.Component<Props, State> {
  state = {
    currentIndex: 0,
    mistakes: 0,
    isShowingAnswer: false,
    isCorrect: true,
  };

  _timeoutID: ?TimeoutID;

  _onTimeout = () => {
    this.continueGame();
  };

  _onContinue = () => {
    this.continueGame();
  };

  continueGame = () => {
    const currentIndex = this.state.currentIndex + 1;
    const mistakes = this.state.mistakes;
    if (currentIndex >= this.props.game.turns.length) {
      this.props.onComplete({
        mistakes,
        length: this.props.game.turns.length,
      });
    } else {
      this.setState({
        currentIndex,
        isShowingAnswer: false,
        isCorrect: true,
      });
    }
  };

  _onPress = (response: boolean) => {
    const isCorrect =
      response === !this.props.game.turns[this.state.currentIndex].incorrect;

    const mistakes = this.state.mistakes + (isCorrect ? 0 : 1);
    this.setState({
      mistakes,
      isShowingAnswer: true,
      isCorrect,
    });
    if (isCorrect) {
      this._timeoutID = setTimeout(this._onTimeout, 500);
    }
  };

  _onPositivePress = () => {
    this._onPress(true);
  };

  _onNegativePress = () => {
    this._onPress(false);
  };

  _renderIcon = () => {
    if (!this.state.isShowingAnswer) {
      return null;
    }
    if (this.state.isCorrect) {
      return <Text style={styles.answerText}>✅</Text>;
    }
    return <Text style={styles.answerText}>🚫</Text>;
  };

  render() {
    const answerIcon = this._renderIcon();
    const buttons =
      this.state.isShowingAnswer && !this.state.isCorrect ? (
        <View style={styles.hContainer}>
          <LabelButton
            label="Continue"
            type="positive"
            onPress={this._onContinue}
          />
        </View>
      ) : (
        <View style={styles.hContainer}>
          <InputElement
            disabled={this.state.isShowingAnswer}
            buttonLabel="Y"
            type="positive"
            onPress={this._onPositivePress}
            inputKey={"a"}
          />
          <View style={{ width: 100 }} />
          <InputElement
            disabled={this.state.isShowingAnswer}
            buttonLabel="N"
            type="negative"
            onPress={this._onNegativePress}
            inputKey={"l"}
          />
        </View>
      );
    return (
      <Container>
        <Text style={styles.word}>
          {this.props.game.turns[this.state.currentIndex].text}
        </Text>
        <View style={styles.answerContainer}>{answerIcon}</View>
        {buttons}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  word: {
    width: "100%",
    textAlign: "center",
    fontSize: 30,
    marginTop: 40,
    marginBottom: 40,
  },
  hContainer: {
    flexDirection: "row",
    padding: 8,
    margin: "auto",
    width: "100%",
    justifyContent: "center",
  },
  inputContainer: {
    alignItems: "center",
  },
  answerContainer: {
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  answerText: {
    fontSize: 40,
  },
});
