<template>
  <Container class="mainpage">
      <Heading1>
        Knowledge Graph Viewer
      </Heading1>
      <Paragraph>
        This application is used to show the relationships between entities in the <a href="https://en.wikipedia.org/wiki/Knowledge_Graph" target="_blank">Google Knowledge Graph</a>.
      </Paragraph>
      <Paragraph>
        The application does not work directly with the graph from Google company. Google Knowledge Graph is not publicly available - with the help of its public API it is not possible to obtain information about the relationships between individual nodes. That was the main reason for developing this app, which works not only with the mentioned API, but also with Google search results.<br><br>
        This site is intended primarily for enthusiasts and academics who are familiar with the issue of knowledge graphs. It was created within the diploma thesis of Martin Škára, <i>Vytvoření nástroje pro zkoumání vztahů v rámci Google Knowledge Graph (Creating a tool for exploring relationships within the Google Knowledge Graph)</i>.
      </Paragraph>
      <Heading2>
        Results for download
      </Heading2>
      <Paragraph>
        The tool itself has some limitations because of difficult data retrieval and in some cases it may not be completely stable, specifically on slower computers. This is one of the reasons why existing results / data can be downloaded in several formats.
      </Paragraph>
      <Row>
        <Col class="xs-stretch" style="margin-bottom: 2rem;">
          <a href="/get/all/json" class="c-button">
            JSON
          </a>
        </Col>
        <Col class="xs-stretch" style="margin-bottom: 2rem;">
          <a href="/get/all/csv" class="c-button">
            CSV
          </a>
        </Col>
        <Col class="xs-stretch" style="margin-bottom: 2rem;">
          <a href="/get/all/rdf" class="c-button">
            RDF
          </a>
        </Col>
        <Col class="xs-stretch" style="margin-bottom: 2rem;">
          <a href="http://localhost:7474/rdf/neo4j/onto" class="c-button">
            Ontology (OWL)
          </a>
        </Col>
      </Row>
      <Heading2>
        How does it work?
      </Heading2>
      <Paragraph>
        This whole tool consists of 3 layers.
      </Paragraph>
      <List>
        <ListItem>Graph database</ListItem>
        <ListItem>Adding entities to graph</ListItem>
        <ListItem>Visualisation</ListItem>
      </List>
      <Heading3>
        Graph database
      </Heading3>
      <Paragraph>
        The entire graph is stored in database. That means, all entities and their relationships (which has been added to graph by any user) are stored in database with which other layers of app work.
      </Paragraph>
      <Heading3>
        Adding entities to graph
      </Heading3>
      <Paragraph>
        The link for adding entities to the graph can be found above in the menu. Here, just write the name of entity you are looking for into the text field and then select from the results that you want to add it to the database. Graph is then updated by the given entity and by several other related entities. This may take a few minutes.
      </Paragraph>
      <Heading3>
        Visualisation
      </Heading3>
      <Paragraph>
        If you want to see the results collected so far, select the option "Show current graph". Here you can see all nodes and relations and which the app was able to obtain.
      </Paragraph>
  </Container>
</template>

<style scoped lang="scss">
  .mainpage {
    padding-top: 2rem;
    padding-bottom: 8rem;
  }
</style>
