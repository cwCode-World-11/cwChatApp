function stringAvatar(name) {
  const len = name.split(" ").length;

  if (len > 1) {
    if (len < 3) {
      return {
        children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
      };
    } else {
      return {
        children: `${name[0]}`,
      };
    }
  } else {
    return {
      children: `${name[0]}`,
    };
  }
}

export default stringAvatar;
