import client from "../connections/elastic.js";

async function createNotesIndex() {
    try {
        const connected = await client.ping();
    if(connected){
        console.log("Elastic search is ready")
        const indexExists = await client.indices.exists({ index: 'notes' });
    if (!indexExists) {
      await client.indices.create({
        index: 'notes',
        body: {
          mappings: {
            properties: {
              userId: { type: 'keyword' },
              title: { type: 'text' }, 
              content: { type: 'text' }, 
            },
          },
        },
      });
      console.log("Notes index created");
    } else {
      console.log("Notes index already exists");
    }
    }else{
        throw new Error("Elastic search not connected")
    }
    } catch (error) {
        console.log("Elastic search is unavailiable =>",error)
    }
}
  
export const addNoteToElasticsearch = async(note)=>{
  try {
    await client.index({
      index: 'notes',
      id: note._id.toString(), 
      body: {
        userId: note.createdBy,  
        title: note.title,
        content: note.description 
      },
    });
    console.log('Note indexed to Elasticsearch');
  } catch (error) {
    console.error('Error indexing note:', error);
  }
}


export const searchNotesByUserAndText = async(userId, query)=> {
    if(!userId || !query) return [];
    try {
      const response = await client.search({
        index: 'notes',
        body: {
          query: {
            bool: {
              must: [
                { match: { title: query } },    
                { match: { content: query } }, 
              ],
              filter:[
                {term:{userId:userId}}
              ]
            },
          },
        },
      });
  
      const notes = response.hits.hits.map(hit => ({
        id: hit._id,
        ...hit._source,
      }));

      return notes;
    } catch (error) {
      console.error("Error searching notes:", error);
      return [];
    }
}

export default createNotesIndex;