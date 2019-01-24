// cavy-cli reporter function.

// Internal: Check that cavy-cli server is running and if so, send report.

export default url => async report => {
  try {
    const response = await fetch(url);
    const text = await response.text();

    if (text == "cavy-cli running") {
      return send(report, url);
    } else {
      throw new Error("Unexpected response");
    }
  } catch (e) {
    // If cavy-cli is not running, let people know in a friendly way
    if (e.message.match(/Network request failed/)) {
      const message =
        "Skipping sending test report to cavy-cli - if you'd " +
        "like information on how to set up cavy-cli, check out the README " +
        "https://github.com/pixielabs/cavy-cli";

      console.log(message);
    } else {
      console.log(`Skipping sending test report to cavy-cli - ${e.message}.`);
    }
  }
};

// Internal: Make a post request to the cavy-cli server with the test report.
async function send(report, url) {
  const options = {
    method: "POST",
    body: JSON.stringify(report),
    headers: {"Content-Type": "application/json"}
  };

  try {
    await fetch(url, options);
    console.log("Cavy test report successfully sent to cavy-cli");
  } catch (e) {
    console.group("Error sending test results");
    console.warn(e.message);
    console.groupEnd();
  }
}
