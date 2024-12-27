import { error } from "elysia";
import mongoose, { FilterQuery } from "mongoose";
import { Quote, QuoteModel } from "../models";

type FilterTransformation = (value: any) => any;

export class QuoteService {
  private static readonly filterTransformations: Record<
    string,
    FilterTransformation
  > = {
    categories: (cats: string[]) => (cats.length ? { $in: cats } : undefined),
    text: (text: string) => ({ $regex: new RegExp(text, "i") }),
    author: (author: string) => ({ $regex: new RegExp(author, "i") }),
  };

  private static cleanFilters(filters: FilterQuery<Quote>): FilterQuery<Quote> {
    return Object.entries(filters).reduce((acc, [key, value]) => {
      if (!value) return acc;
      const transform = this.filterTransformations[key];
      const transformedValue = transform ? transform(value) : value;
      if (transformedValue !== undefined) {
        acc[key] = transformedValue;
      }
      return acc;
    }, {} as FilterQuery<Quote>);
  }

  static async findQuotes(filters: FilterQuery<Quote>) {
    return QuoteModel.find(this.cleanFilters(filters));
  }

  static async findQuoteById(id: mongoose.Types.ObjectId) {
    const quote = await QuoteModel.findById(id);
    if (!quote) throw error(404);
    return quote;
  }

  static async addQuote(quote: Quote) {
    return QuoteModel.create(quote);
  }

  static async deleteQuote(id: string) {
    const deletedQuote = await QuoteModel.findByIdAndDelete(id);
    if (!deletedQuote) throw error(404);
    return deletedQuote;
  }

  static async updateQuote(id: string, quote: Partial<Quote>) {
    const updatedQuote = await QuoteModel.findByIdAndUpdate(id, quote, {
      new: true,
    });
    if (!updatedQuote) throw error(404);
    return updatedQuote;
  }
}
