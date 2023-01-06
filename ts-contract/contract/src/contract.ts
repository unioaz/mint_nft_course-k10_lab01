// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view, initialize, LookupMap, UnorderedMap } from 'near-sdk-js';
import { AccountId } from 'near-sdk-js/lib/types';

class Token {
  token_id: number;
  account_id: AccountId;

  title?: string;
  description?: string;
  media?: string;
  media_hash?: string;
  copies?: number;
  issued_at?: number;
  expires_at?: number;
  from_indexs_at?: number;
  updated_at?: number;
  extra?: string;
  reference?: string;
  reference_hash?: string;

  name?: string;
  level?: number;

  constructor( token_id: number,
    account_id: AccountId,
    title: string,
    description: string,
    media: string,
    // media_hash: string,
    copies: number,
    // issued_at: number,
    // expires_at: number,
    // from_indexs_at: number,
    // updated_at: number,
    extra: string,
    reference: string,
    // reference_hash: string,
    name: string,
    level: number,
    ) {
    (this.token_id = token_id);
    (this.account_id = account_id);

    (this.title = title);
    (this.description = description);
    (this.media = media);
    // (this.media_hash = media_hash);
    (this.copies = copies);
    // (this.issued_at = issued_at);
    // (this.expires_at = expires_at);
    // (this.from_indexs_at = from_indexs_at);
    // (this.updated_at = updated_at);
    (this.extra = extra);
    (this.reference = reference);
    // (this.reference_hash = reference_hash);

    (this.name = name);
    (this.level = level);
  }
}

@NearBindgen({})
class Contract {
  token_id: number;
  account_id: AccountId;
  owner_by_id: LookupMap<string>;
  token_by_id: LookupMap<Token>;

  spec: string;
  name: string;
  symbol: string;
  icon?: string;
  base_uri?: string;
  reference?: string;
  reference_hash?: string;

  constructor() {
    this.token_id = 0;
    this.account_id = ""
    this.owner_by_id = new LookupMap("0")
    this.token_by_id = new LookupMap("t")

    this.spec = "nft-1.0.0"
    this.name = "Metaverse 0.3"
    this.symbol = "META03"
    this.icon = "https://cdn-icons-png.flaticon.com/512/1078/1078454.png"
    this.base_uri = "https://docs.near.org/assets/images/protocol-b73c2a3ace3307226ee7eb2149ee432f.png"
    this.reference = "something.json"
    this.reference_hash = null
  }

  @initialize({})
  init({ account_id, prefix }: { account_id: AccountId; prefix: string }) {
    this.token_id = 0
    this.account_id = account_id,
    this.owner_by_id = new LookupMap(prefix);
    this.token_by_id = new LookupMap("t")
  }

  @call({}) // token_id = 0
  mint_nft({ token_account_id, title, description, media, copies, extra, reference, name, level }) {
    this.owner_by_id.set(this.token_id.toString(), token_account_id); // {tokenId = 0, 'hunguni.testnet'}
    let token = new Token(this.token_id, token_account_id, title, description, media, copies, extra, reference, name, level)

    this.token_by_id.set(this.token_id.toString(), token)

    this.token_id++;

    return token;
  }

  /// Enumeration

  @view({})
  nft_supply_tokens() {
    return this.token_id.toString();
  }

  @view({})
  nft_tokens({ from_index=0, limit=undefined }: { from_index: number, limit: number }) {
    if ( limit === undefined ){
      limit = this.token_id
    }
    var all_tokens = []

    for(var i = from_index; i < this.token_id && limit > 0; i++) {
      let token = this.token_by_id.get(i.toString())
      all_tokens.push(token);
      limit--;
    }

    return all_tokens;
  }

  @view({}) 
  nft_supply_for_owner({account_id}: {account_id: AccountId}) {
    var owner_supply = 0

    for(var i = 0; i < this.token_id; i++) {
      let token = this.token_by_id.get(i.toString())
      if (token.account_id == account_id) {
        owner_supply++
      }
    }

    return owner_supply.toString();
  }

  @view({})
  nft_tokens_for_owner({account_id, from_index=0, limit=undefined }: { account_id: AccountId, from_index: number, limit: number }) {
    if ( limit === undefined ){
      limit = this.token_id
    }
    var all_tokens = []

    for(var i = from_index; i < this.token_id && limit > 0; i++) {
      let token = this.token_by_id.get(i.toString())
      if (token.account_id == account_id) {
        all_tokens.push(token)
        limit--;
      }
    }

    return all_tokens;
  }

  /// studying

  @view({}) // token_id = 0
  get_token_id({token_id}: { token_id: number}) {
    let token = this.token_by_id.get(token_id.toString())

    if (token === null) {
      return null;
    }

    return token;
  }

  @view({})
  get_all_tokens() {
    var all_tokens = []

    for(var i = 0; i < this.token_id; i++) {
      all_tokens.push(this.token_by_id.get(i.toString()))
    }

    return all_tokens;
  }

  @view({})
  get_all_tokens_for_owner({account_id}: {account_id: AccountId}) {
    var all_tokens = []

    for(var i = 0; i < this.token_id; i++) {
      let token = this.token_by_id.get(i.toString())
      if (token.account_id == account_id) {
        all_tokens.push(token)
      }
    }

    return all_tokens;
  }

  @view({})
  get_all_tokens_range({from_index, limit}: {from_index: number, limit: number}) {
    var all_tokens = []

    for(var i = from_index; i < this.token_id && limit > 0; i++, limit--) {
      let token = this.token_by_id.get(i.toString())
      all_tokens.push(token)
    }

    return all_tokens;
  }
}
