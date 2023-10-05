import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
const App = () => {
  const [friends, setFriend] = useState(initialFriends);
  const [showAddFriend, setShowFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleShowFriend = () => {
    setShowFriend((curr) => !curr);
  };
  const handleSetFriend = (friend) => {
    setFriend((curr) => [...curr, friend]);
    setShowFriend(false);
    selectedFriend(null);
  };
  const handleSelectFriend = (friend) => {
    setSelectedFriend((currSelected) =>
      currSelected?.id === friend.id ? null : friend
    );
    setShowFriend(false); //set the state of the add friend form back to false so it won't be visible at the same the as the billl form
  }; //If the id of currently selected friend is the same as friend id then toggle the state bck to null, if it's the same set the state value to the friend

  const handleSplitBill = (value) => {
    //if the id of friend is matching selected friend id then update his balance
    setFriend((curr) =>
      curr.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  };
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelect={handleSelectFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleSetFriend} />}
        <Button onClick={handleShowFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplit={handleSplitBill}
        />
      )}
    </div>
  );
};
const FriendsList = ({ friends, onSelect, selectedFriend }) => {
  return (
    <ul>
      {friends.map((friend, index) => (
        <Friend
          friend={friend}
          key={index}
          onSelect={onSelect}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
};
const Friend = ({ friend, onSelect, selectedFriend }) => {
  const isSelected = selectedFriend?.id === friend.id; //optional chaining, check if the id of current friend matches id of selected friend

  return (
    <li className={isSelected ? "selected" : "open"}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)} €
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)} €
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelect(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
};
const Button = ({ children, onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
};
const FormAddFriend = ({ onAddFriend }) => {
  const [friendName, setFriendName] = useState("");
  const [profileImage, setProfileImage] = useState(
    "https://i.pravatar.cc/48?u"
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!friendName || !profileImage) return;
    const id = crypto.randomUUID();
    const newFriend = {
      name: friendName,
      image: `${profileImage}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setFriendName("");
    setProfileImage("https://i.pravatar.cc/48?u");
  };
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🙍🏻 Friend name</label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
      ></input>
      <label>👤 Image URL</label>
      <input
        type="text"
        value={profileImage}
        onChange={(e) => setProfileImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
};
const FormSplitBill = ({ selectedFriend, onSplit }) => {
  const [bill, setBill] = useState("");
  const [paidUser, setPaidUser] = useState("");
  const paidFriend = bill ? bill - paidUser : "";
  const [whoPays, setWhoPays] = useState("user");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bill || !paidUser) return;
    onSplit(whoPays === "user" ? paidFriend : -paidUser);
  };
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split bill with {selectedFriend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />
      <label>🧍🏻‍♂️ Your expense</label>
      {/*first we check if the userPaid value is grater than bill, if yes then dont change the value, else set it to the value from the input. Like this the paidUser value cannot be grater than the bill*/}
      <input
        type="text"
        value={paidUser}
        onChange={(e) =>
          setPaidUser(+e.target.value > bill ? paidUser : +e.target.value)
        }
      />
      <label>🙍🏻 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidFriend} />
      <label>Who is paying the bill?</label>
      <select value={whoPays} onChange={(e) => setWhoPays(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
};
export default App;
