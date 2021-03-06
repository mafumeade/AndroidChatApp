import React, { Component } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, TouchableNativeFeedback } from "react-native";
import { connect } from "react-redux";
import { Header, Input, Icon, Avatar } from "react-native-elements";
import { Transition } from "react-navigation-fluid-transitions";

import { getContacts } from "../actions/contactActions";
import { sendMessage, updateTypingStatus } from "../actions/chatActions";
import Message from "../components/Message";

class ChatScreen extends Component {
  state = {
    messages: [],
    inputMessage: "",
    isTyping: false,
    contact: {},
  };

  renderMessages() {
    const contactUsername = this.props.navigation.getParam("contact");
    console.log("CONTACT USERNAME:", contactUsername);

    return (this.props.messages[contactUsername] || []).map(msg => (
      <Message key={msg.date} from={msg.from} text={msg.text} isOutgoing={msg.from === this.props.username} />
    ));
  }

  componentWillMount() {
    for (let c in this.props.contacts) {
      let contact = this.props.contacts[c];
      if (contact.username === this.props.navigation.getParam("contact")) {
        this.setState({ contact });
      }
    }
  }

  sendMessagePressed = () => {
    const to = this.props.navigation.getParam("contact");
    const { inputMessage } = this.state;
    const { username } = this.props;

    this.props.sendMessage(to, inputMessage, username);
    this.setState({ inputMessage: "" });

    this.props.updateTypingStatus(to, false);
  };

  inputUpdated = inputMessage => {
    this.setState({ inputMessage });

    const isTyping = inputMessage !== "";
    if (isTyping !== this.state.isTyping) {
      this.setState({ isTyping });

      const to = this.props.navigation.getParam("contact");
      this.props.updateTypingStatus(to, isTyping);
    }
  };

  renderTyping = () => {
    const username = this.props.navigation.getParam("contact");

    console.log("TYPING USERS", this.props.typingUsers);
    console.log("USERNAME", username);
    if (this.props.typingUsers.indexOf(username) >= 0) {
      return <Text style={styles.typingStyle}>{username} is typing...</Text>;
    }

    return null;
  };

  render() {
    const contactUsername = this.props.navigation.getParam("contact");
    const leftComponent = (
      <TouchableNativeFeedback
        onPress={() => {
          this.props.navigation.navigate("contacts");
        }}
      >
        <View style={{ padding: 15 }}>
          <Icon name="chevron-left" type="font-awesome" color="white" />
        </View>
      </TouchableNativeFeedback>
    );

    const centerComponent = (
      <View>
        <Avatar rounded source={{ uri: `https://api.adorable.io/avatars/285/${contactUsername}` }} />
        <Text style={{ color: "#fff", flex: 1, textAlign: "center" }}>{contactUsername}</Text>
      </View>
    );

    const statusComponent = () => {
      if (this.state.contact.online) {
        return <Text style={{ color: "#00E500", textAlign: "center" }}>Online</Text>;
      }
      return <Text style={{ color: "#F00", textAlign: "center" }}>Offline</Text>;
    };

    return (
      <View style={{ flex: 1 }}>
        <Header leftComponent={leftComponent} centerComponent={centerComponent} rightComponent={statusComponent()} />

        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <View style={{ flexDirection: "column", justifyContent: "flex-end", flex: 1 }}>
            <ScrollView>{this.renderMessages()}</ScrollView>

            <View>
              {this.renderTyping()}
              <Input
                placeholder="Enter your message..."
                rightIcon={{
                  name: "sc-telegram",
                  type: "evilicon",
                  color: "#517fa4",
                  onPress: () => this.sendMessagePressed(),
                  size: 30,
                }}
                value={this.state.inputMessage}
                onChangeText={inputMessage => this.inputUpdated(inputMessage)}
                multiline
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = {
  typingStyle: {
    color: "#666",
    marginLeft: 10,
  },
};

const mapStateToProps = state => ({
  contacts: state.contacts.contacts,
  username: state.auth.username,
  messages: state.chat,
  typingUsers: state.typingUsers,
});

const mapDispatchToProps = { getContacts, sendMessage, updateTypingStatus };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatScreen);
