<template>
  <Container class="mainpage">
      <Heading1>
        Knowledge Graph Viewer
      </Heading1>
      <Paragraph>
        Tato aplikace slouží k zobrazení vztahů mezi entitami v
        <a href="https://en.wikipedia.org/wiki/Knowledge_Graph" target="_blank">Google Knowledge Graph</a>.
      </Paragraph>
      <Paragraph>
        Aplikace však nepracuje přímo se samotným znalostním grafem společnosti Google. Ten není veřejně dostupný, respektive s pomocí jeho veřejného API nelze získat informace o vztazích mezi jednotlivými uzly. Z tohoto důvodu tak byla tato aplikace vyvinuta, a pracuje právě již jak se zmíněným API, tak s výsledky klasického vyhledávání pomocí Googlu.<br><br>
        Tato stránka má sloužit především nadšencům a akademikům, kteří jsou s problematikou znalostních grafů obeznámeni. Byla vytvořena v rámci diplomové práce Martin Škáry <i>Vytvoření nástroje pro zkoumání vztahů v rámci Google Knowledge Graph</i>.
      </Paragraph>
      <Heading2>
        Jak to funguje?
      </Heading2>
      <Paragraph>
        Celý tento nástroj tvoří 3 "vrstvy".
      </Paragraph>
      <List>
        <ListItem>Databáze</ListItem>
        <ListItem>Přidávání entit do grafu</ListItem>
        <ListItem>Vizualizace grafu</ListItem>
      </List>
      <Heading3>
        Databáze
      </Heading3>
      <Paragraph>
        Celý dosavadně vytvořený graf je uložen v databázi. Tj. všechny entity a jejich vztahy, které byly již do grafu přidány jakýmkoliv uživatelem, jsou uloženy ve výsledné databázi, s kteoru další vrstvy aplikace pracují.
      </Paragraph>
      <Heading3>
        Přidávání entit do grafu
      </Heading3>
      <Paragraph>
        Odkaz pro přidání entit do grafu lze nalézt výše v menu. Zde stačí do textového pole uvést jakou entitu hledáte a z výsledků pak vybrat, že ji chcete přidat do databáze. Graf pak během několika minut bude aktualizován o danou entitu i o několik dalších entit příbuzných.
      </Paragraph>
      <Heading3>
        Vizualizace grafu
      </Heading3>
      <Paragraph>
        Pokud chcete vidět dosavadní výsledky, zvolte možnost "Zobrazit dosavadní graf". Zde jsou vidět všechny uzly grafu a vztahy mezi nimi, které by z dosavadně již přidaných entit schopen nástroj nalézt. Mimo to zde lze výsledný graf exportovat do vybraných formátů.
      </Paragraph>
  </Container>
</template>

<style scoped lang="scss">
  .mainpage {
    padding-top: 2rem;
    padding-bottom: 8rem;
  }
</style>
