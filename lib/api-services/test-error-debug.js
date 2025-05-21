try {
  throw new Error("Test error for stack trace");
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.stack || error.message);
  } else {
    console.error("Error:", JSON.stringify(error));
  }
}
