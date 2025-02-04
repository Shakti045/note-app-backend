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
          settings: {
            analysis: {
              filter: {
                lowercase_filter: {
                  type: 'lowercase'
                }
              },
              analyzer: {
                edge_ngram_analyzer: {
                  tokenizer: 'edge_ngram_tokenizer',
                  filter: ['lowercase_filter']
                }
              },
              tokenizer: {
                edge_ngram_tokenizer: {
                  type: 'edge_ngram',
                  min_gram: 2,
                  max_gram: 10,
                  token_chars: ['letter', 'digit']
                }
              }
            }
          },
          mappings: {
            properties: {
              userId: { type: 'keyword' },
              title: { type: 'text', analyzer: 'edge_ngram_analyzer' }, 
              content: { type: 'text', index: false, store: true } 
            }
          }
        }
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
                { match: { title: query.toLowerCase() } },    
                // { match: { content: query } }, 
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

export const  updateNoteFromElastic = async(noteId, newTitle,newContent) =>{
  try {
    await client.update({
      index: 'notes',
      id: noteId,
      body: {
        doc: {
          title: newTitle, 
          content:newContent,
        }
      }
    });
  } catch (error) {
    console.error("Error updating note:", error);
  }
}


export const deleteNoteFromElastic = async(noteId) =>{
  try {
    await client.delete({
      index: 'notes',
      id: noteId
    });
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}

export default createNotesIndex;