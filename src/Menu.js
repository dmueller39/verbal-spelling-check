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
} from "react-native";
import type { VerbalGame } from "./types";
import LabelButton from "./common/LabelButton";
import Container from "./common/Container";

export type Props = {|
  now: number,
  results: ?(VerbalLogEntry[]),
  options: Array<{ getGamePlan: () => VerbalGame, name: string }>,
  setGame: (VerbalGame) => void,
|};

export default function Menu(props: Props) {
  const { setGame } = props;

  const buttons = props.options.map(({ getGamePlan, name }) => {
    return (
      <LabelButton
        key={name}
        label={"Play"}
        onPress={() => setGame(getGamePlan())}
        type="positive"
        style={styles.labelButton}
      />
    );
  });

  /** todo, only render scrollview on iOS/Android */
  return <Container>{buttons}</Container>;
}

const styles = StyleSheet.create({ labelButton: { alignSelf: "center" } });
