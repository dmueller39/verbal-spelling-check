// @flow
import * as React from "react";

import { StyleSheet, View } from "react-native";

export default function Container({ children }: { children?: ?any }) {
  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  subcontainer: {
    marginHorizontal: "auto",
    height: "100%",
    maxWidth: 600,
    width: "100%",
  },
});
