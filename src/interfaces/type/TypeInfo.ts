export interface TypeInfo {
  typeName: string;
  typeColor: string;
  typeImg: string;
  typeOneComment: string;
  typeDesc: string;
  typeRulesTitle: string;
  typeRules: string[];
  good: Compatibility;
  bad: Compatibility;
}

interface Compatibility {
  typeName: string;
  typeImg: string;
}
