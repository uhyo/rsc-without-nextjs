export const Uhyo = (async () => {
  const uhyoData = (
    await import("../../data/uhyo.json", {
      assert: { type: "json" },
    })
  ).default;
  return (
    <section>
      <h2>Hello, I'm {uhyoData.name}</h2>
      <p>I am {uhyoData.age} years old.</p>
      <p>My favorite languages are:</p>
      <ul>
        {uhyoData.favoriteLanguages.map((lang, i) => (
          <li key={i}>{lang}</li>
        ))}
      </ul>
    </section>
  );
}) as unknown as React.FC;
